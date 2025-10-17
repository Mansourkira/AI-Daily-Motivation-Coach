-- =========================================================
-- RiseMind (strict ownership model)
-- auth.users is the source of truth; our "profiles.id" == auth.uid()
-- =========================================================

create extension if not exists pgcrypto;

-- reusable trigger to keep updated_at fresh
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end$$;

-- --------------------------
-- 1) profiles (user management)
-- --------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  onboarding_done boolean not null default false,
  name text
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.tg_set_updated_at();

-- --------------------------
-- 2) settings (1:1 with profiles)
-- --------------------------
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  locale text not null default 'en' check (locale in ('en','fr','ar')),
  wake_time text not null default '07:00' check (wake_time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  focus_areas text[] not null default '{}'::text[] check (array_length(focus_areas,1) is null or array_length(focus_areas,1) <= 3),
  notifications boolean not null default false,
  ads_consent text not null default 'not_set' check (ads_consent in ('granted','denied','not_set')),

  unique (user_id)
);

drop trigger if exists set_settings_updated_at on public.settings;
create trigger set_settings_updated_at
before update on public.settings
for each row execute procedure public.tg_set_updated_at();

-- --------------------------
-- 3) goals (<=3 active per user – enforce in app for MVP)
-- --------------------------
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  text text not null check (length(text) <= 80),
  archived_at timestamptz
);

-- --------------------------
-- 4) plans (one per user per date)
-- --------------------------
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  date date not null,
  source_prompt_hash text,
  unique (user_id, date)
);

-- --------------------------
-- 5) tasks (children of plans)
-- --------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  created_at timestamptz not null default now(),
  text text not null,
  at text, -- 'HH:MM' optional
  done boolean not null default false,
  order_index int not null default 0 check (order_index >= 0)
);

-- --------------------------
-- 6) catalogs (optional but useful for UX)
-- --------------------------
create table if not exists public.focus_area_catalog (
  key text primary key,               -- e.g. 'health','study','work','finance','faith','personal','relationships'
  label_en text not null,
  label_fr text not null,
  label_ar text not null
);

create table if not exists public.goal_suggestion_catalog (
  id uuid primary key default gen_random_uuid(),
  focus_area_key text not null references public.focus_area_catalog(key) on delete cascade,
  text_en text not null,
  text_fr text not null,
  text_ar text not null
);

-- Seed basic focus areas (you can add more)
insert into public.focus_area_catalog(key,label_en,label_fr,label_ar) values
('health','health','santé','الصحة'),
('study','study','études','الدراسة'),
('work','work','travail','العمل'),
('finance','finance','finances','المال'),
('faith','faith','foi','الإيمان'),
('personal','personal','personnel','شخصي'),
('relationships','relationships','relations','العلاقات')
on conflict (key) do nothing;

-- --------------------------
-- Indexes
-- --------------------------
create index if not exists idx_settings_user_id on public.settings(user_id);

create index if not exists idx_goals_user_id on public.goals(user_id);
create index if not exists idx_goals_archived_active on public.goals(user_id) where archived_at is null;

create index if not exists idx_plans_user_id on public.plans(user_id);
create index if not exists idx_plans_date on public.plans(date);

create index if not exists idx_tasks_plan_id on public.tasks(plan_id);
create index if not exists idx_tasks_order on public.tasks(plan_id, order_index);

-- =========================================================
-- RLS (strict: each row belongs to auth.uid())
-- =========================================================
alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.goals    enable row level security;
alter table public.plans    enable row level security;
alter table public.tasks    enable row level security;
alter table public.focus_area_catalog enable row level security;
alter table public.goal_suggestion_catalog enable row level security;

-- Read-only to everyone for catalogs
drop policy if exists "catalogs are readable" on public.focus_area_catalog;
create policy "catalogs are readable" on public.focus_area_catalog
  for select to authenticated using (true);

drop policy if exists "goal suggestions are readable" on public.goal_suggestion_catalog;
create policy "goal suggestions are readable" on public.goal_suggestion_catalog
  for select to authenticated using (true);

-- Ownership policies
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "own settings" on public.settings;
create policy "own settings" on public.settings
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "own goals" on public.goals;
create policy "own goals" on public.goals
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "own plans" on public.plans;
create policy "own plans" on public.plans
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "own tasks" on public.tasks;
create policy "own tasks" on public.tasks
  for all to authenticated
  using (
    plan_id in (select id from public.plans where user_id = auth.uid())
  )
  with check (
    plan_id in (select id from public.plans where user_id = auth.uid())
  );

-- =========================================================
-- Helper RPC: upsert profile + settings in one call after auth
-- =========================================================
create or replace function public.upsert_profile_settings(
  p_name text,
  p_locale text,
  p_wake_time text,
  p_focus_areas text[],
  p_notifications boolean,
  p_ads_consent text
) returns void
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, name, onboarding_done)
  values (auth.uid(), p_name, true)
  on conflict (id) do update set
    name = excluded.name,
    onboarding_done = true,
    updated_at = now();

  insert into public.settings (user_id, locale, wake_time, focus_areas, notifications, ads_consent)
  values (auth.uid(), coalesce(p_locale,'en'), coalesce(p_wake_time,'07:00'),
          coalesce(p_focus_areas, '{}'::text[]), coalesce(p_notifications,false), coalesce(p_ads_consent,'not_set'))
  on conflict (user_id) do update set
    locale = excluded.locale,
    wake_time = excluded.wake_time,
    focus_areas = excluded.focus_areas,
    notifications = excluded.notifications,
    ads_consent = excluded.ads_consent,
    updated_at = now();
end;
$$;

-- allow authenticated users to call it
revoke all on function public.upsert_profile_settings(text,text,text,text[],boolean,text) from public;
grant execute on function public.upsert_profile_settings(text,text,text,text[],boolean,text) to authenticated;
