# Supabase Database Schema

This directory contains database migrations for the AI Daily Motivation Coach app.

## Schema Overview

The database consists of 5 main tables:

### 1. users
Stores user information and onboarding status.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| onboarding_done | BOOLEAN | Whether user completed onboarding |
| name | TEXT | Optional user name |

### 2. settings
User preferences and configuration.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| locale | TEXT | Language ('en', 'fr', 'ar') |
| wake_time | TEXT | Wake up time (e.g., '07:00') |
| focus_areas | TEXT[] | Array of focus areas |
| notifications | BOOLEAN | Notifications enabled |
| ads_consent | TEXT | Ads consent status |

### 3. goals
User goals and objectives.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| created_at | TIMESTAMP | Creation timestamp |
| text | TEXT | Goal description |
| archived_at | TIMESTAMP | Archive timestamp (null if active) |

### 4. plans
Daily plans for each date.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| created_at | TIMESTAMP | Creation timestamp |
| date | DATE | Plan date (unique per user) |
| source_prompt_hash | TEXT | Hash of AI prompt used |

### 5. tasks
Tasks within each daily plan.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| plan_id | UUID | Foreign key to plans |
| created_at | TIMESTAMP | Creation timestamp |
| text | TEXT | Task description |
| at | TEXT | Scheduled time (optional) |
| done | BOOLEAN | Completion status |
| order_index | INTEGER | Display order |

## Indexes

- `idx_settings_user_id`: Fast lookup of user settings
- `idx_goals_user_id`: Fast lookup of user goals
- `idx_goals_archived_at`: Filter active goals efficiently
- `idx_plans_user_id`: Fast lookup of user plans
- `idx_plans_date`: Quick date-based queries
- `idx_tasks_plan_id`: Efficient task retrieval
- `idx_tasks_order`: Ordered task display

## Row Level Security (RLS)

All tables have RLS enabled with permissive policies for MVP/development. 

**Current Policies:**
- All operations allowed for all users (USING true)

**Production Recommendations:**
- Implement proper authentication
- Update policies to use `auth.uid()`
- Restrict users to their own data

Example production policy:
```sql
CREATE POLICY "Users can only access their own data"
ON public.goals
FOR ALL
USING (user_id = auth.uid());
```

## Triggers

- `update_users_updated_at`: Auto-update `updated_at` on users table
- `update_settings_updated_at`: Auto-update `updated_at` on settings table

## Running Migrations

### Option 1: Supabase Dashboard
1. Go to SQL Editor
2. Copy contents of `001_initial_schema.sql`
3. Paste and run

### Option 2: Supabase CLI
```bash
supabase db push
```

## Schema Version

Current version: 1 (001_initial_schema.sql)

## Future Migrations

When adding new migrations:
1. Create a new file: `002_description.sql`
2. Include rollback instructions in comments
3. Test on staging before production
4. Update this README with changes

