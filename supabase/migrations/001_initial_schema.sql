-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    onboarding_done BOOLEAN DEFAULT FALSE,
    name TEXT
);

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    locale TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'fr', 'ar')),
    wake_time TEXT NOT NULL DEFAULT '07:00',
    focus_areas TEXT[] DEFAULT '{}',
    notifications BOOLEAN DEFAULT FALSE,
    ads_consent TEXT DEFAULT 'not_set' CHECK (ads_consent IN ('granted', 'denied', 'not_set')),
    UNIQUE(user_id)
);

-- Create goals table
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    text TEXT NOT NULL,
    archived_at TIMESTAMP WITH TIME ZONE
);

-- Create plans table
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date DATE NOT NULL,
    source_prompt_hash TEXT,
    UNIQUE(user_id, date)
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    text TEXT NOT NULL,
    at TEXT,
    done BOOLEAN DEFAULT FALSE,
    order_index INTEGER NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_settings_user_id ON public.settings(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_archived_at ON public.goals(archived_at) WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_plans_user_id ON public.plans(user_id);
CREATE INDEX IF NOT EXISTS idx_plans_date ON public.plans(date);
CREATE INDEX IF NOT EXISTS idx_tasks_plan_id ON public.tasks(plan_id);
CREATE INDEX IF NOT EXISTS idx_tasks_order ON public.tasks(plan_id, order_index);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for anonymous access (for demo/MVP)
-- In production, you would use auth.uid() instead

-- Users policies (allow all for now)
CREATE POLICY "Enable all operations for users" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- Settings policies
CREATE POLICY "Enable all operations for settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);

-- Goals policies
CREATE POLICY "Enable all operations for goals" ON public.goals FOR ALL USING (true) WITH CHECK (true);

-- Plans policies
CREATE POLICY "Enable all operations for plans" ON public.plans FOR ALL USING (true) WITH CHECK (true);

-- Tasks policies
CREATE POLICY "Enable all operations for tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

