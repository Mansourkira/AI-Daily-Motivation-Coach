# Supabase Setup Guide

This guide will help you set up Supabase for your AI Daily Motivation Coach app.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed
- The Supabase CLI (optional, for local development)

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: AI Daily Coach (or your preferred name)
   - Database Password: Create a strong password
   - Region: Choose the closest to your users
4. Click "Create new project"

## Step 2: Configure Environment Variables

Create a `.env` file in the root of your project:

```env
EXPO_PUBLIC_SUPABASE_URL=https://lhommbfjfruiekqukqvc.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_anon_key_here
```

**Important:** Replace the values with your actual Supabase credentials:

1. Go to your Supabase project dashboard
2. Click on "Settings" (gear icon) in the sidebar
3. Click on "API" in the settings menu
4. Copy the "Project URL" and use it for `EXPO_PUBLIC_SUPABASE_URL`
5. Copy the "anon public" key and use it for `EXPO_PUBLIC_SUPABASE_KEY`

**Note:** The user provided URL is already set. You just need to add the correct API key.

## Step 3: Run Database Migration

You need to create the database tables in Supabase. There are two ways to do this:

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the sidebar
3. Click "New query"
4. Copy the contents of `supabase/migrations/001_initial_schema.sql`
5. Paste it into the SQL editor
6. Click "Run" to execute the migration

### Option B: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Initialize Supabase in your project
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

## Step 4: Verify Setup

The database schema includes the following tables:

- **users**: Stores user information and onboarding status
- **settings**: User preferences (locale, wake time, focus areas, etc.)
- **goals**: User goals
- **plans**: Daily plans
- **tasks**: Tasks within each daily plan

All tables have Row Level Security (RLS) enabled with policies that allow all operations for now. In production, you should update these policies to use proper authentication.

## Step 5: Test the App

1. Make sure your `.env` file is properly configured
2. Run your app:
   ```bash
   npm start
   ```
3. The app should connect to Supabase automatically
4. You'll see "Connecting to cloud database..." while initializing

## Database Features

### Anonymous User Support

The app creates anonymous users automatically. Each device gets a unique user ID stored locally, which is used to sync data with Supabase.

### Cloud Sync

All data is automatically synced to Supabase:
- Goals are saved to the cloud
- Daily plans and tasks are stored online
- Settings are synchronized
- Data persists across app reinstalls (as long as the device ID is preserved)

### Offline Support (Future Enhancement)

Currently, the app requires an internet connection. For offline support, you would need to:
1. Implement local caching with AsyncStorage or SQLite
2. Add a sync mechanism to upload changes when online
3. Handle conflict resolution for simultaneous edits

## Security Considerations

### Current Setup (MVP/Development)

The current RLS policies allow all operations for any user. This is fine for:
- MVPs and prototypes
- Single-user apps
- Development and testing

### Production Setup

For production, you should:

1. **Enable Supabase Auth**:
   ```typescript
   // Update lib/supabase.ts to use auth
   const { data, error } = await supabase.auth.signInAnonymously();
   ```

2. **Update RLS Policies**:
   ```sql
   -- Example: Restrict users to their own data
   CREATE POLICY "Users can only access their own goals"
   ON public.goals
   FOR ALL
   USING (user_id = auth.uid());
   ```

3. **Add Authentication UI**:
   - Sign up / Sign in screens
   - Password reset
   - Social auth (Google, Apple, etc.)

## Monitoring & Debugging

### Check Database in Supabase Dashboard

1. Go to "Table Editor" to view your data
2. Use "Database" > "Logs" to see query logs
3. Check "API" > "Logs" for API request logs

### Common Issues

**Error: Missing Supabase environment variables**
- Make sure `.env` file exists and contains the correct values
- Restart your dev server after adding environment variables

**Error: Database initialization timeout**
- Check your internet connection
- Verify your Supabase project is active
- Check if the API key is correct

**Error: relation "users" does not exist**
- Run the migration script (Step 3)
- Verify tables were created in Supabase Dashboard

## Migration from AsyncStorage

The app has been migrated from AsyncStorage to Supabase. Key changes:

1. **Store Actions are now async**: All store actions return Promises
2. **Data Loading**: Use `loadData()` to fetch data from Supabase
3. **Auto-sync**: Changes are automatically saved to Supabase

### Update Your Code

If you have existing code using the store, update it:

```typescript
// Old (AsyncStorage)
addGoal('My goal');
setSettings({ locale: 'fr' });

// New (Supabase)
await addGoal('My goal');
await setSettings({ locale: 'fr' });
```

## API Reference

### Database Service Methods

```typescript
// Initialize (called automatically by DBProvider)
await databaseService.initDatabase();

// User & Onboarding
await databaseService.getOnboardingStatus(): Promise<boolean>
await databaseService.setOnboardingDone(done: boolean): Promise<void>

// Settings
await databaseService.getSettings(): Promise<Settings>
await databaseService.updateSettings(settings: Partial<Settings>): Promise<void>

// Goals
await databaseService.getGoals(): Promise<Goal[]>
await databaseService.addGoal(text: string): Promise<Goal>
await databaseService.removeGoal(id: string): Promise<void>

// Plans & Tasks
await databaseService.getPlans(): Promise<Record<string, DailyPlan>>
await databaseService.savePlan(plan: DailyPlan): Promise<void>
await databaseService.toggleTask(date: string, taskId: string): Promise<void>

// Utility
databaseService.getUserId(): string | null
await databaseService.resetAllData(): Promise<void>
```

## File Structure

```
├── lib/
│   ├── supabase.ts           # Supabase client configuration
│   └── supabase.types.ts     # TypeScript types for database
├── services/
│   ├── database.ts           # Main database export
│   └── database.supabase.ts  # Supabase database service
├── providers/
│   └── DBProvider.tsx        # Database initialization provider
├── contexts/
│   └── store.ts              # Zustand store with Supabase integration
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql  # Database schema
```

## Next Steps

1. ✅ Set up environment variables
2. ✅ Run database migration
3. ✅ Test the app
4. 🔄 (Optional) Add authentication
5. 🔄 (Optional) Update RLS policies for production
6. 🔄 (Optional) Add offline support with local caching

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review the migration script: `supabase/migrations/001_initial_schema.sql`
- Check console logs for detailed error messages

