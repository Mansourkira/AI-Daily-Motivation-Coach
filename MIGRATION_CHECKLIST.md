# Supabase Migration Checklist

Use this checklist to ensure your migration from SQLite to Supabase is complete.

## ✅ Pre-Migration

- [ ] Backup your current data (if any)
- [ ] Have a Supabase account ready
- [ ] Note your Supabase project URL and API key

## ✅ Installation

- [x] Dependencies installed (`@supabase/supabase-js`, `react-native-url-polyfill`)
- [ ] Run `npm install --legacy-peer-deps` (if not already done)

## ✅ Configuration

- [ ] Created `.env` file in project root
- [ ] Added `EXPO_PUBLIC_SUPABASE_URL` to `.env`
- [ ] Added `EXPO_PUBLIC_SUPABASE_KEY` to `.env`
- [ ] Restarted development server after adding `.env`

## ✅ Database Setup

- [ ] Opened Supabase SQL Editor
- [ ] Copied contents from `supabase/migrations/001_initial_schema.sql`
- [ ] Ran the migration SQL successfully
- [ ] Verified 5 tables created in Table Editor:
  - [ ] users
  - [ ] settings
  - [ ] goals
  - [ ] plans
  - [ ] tasks

## ✅ Code Changes

All code changes are complete:

- [x] Created `lib/supabase.ts` (Supabase client)
- [x] Created `lib/supabase.types.ts` (TypeScript types)
- [x] Created `services/database.supabase.ts` (Database service)
- [x] Updated `services/database.ts` (Use Supabase service)
- [x] Updated `contexts/store.ts` (Async actions for Supabase)
- [x] Updated `providers/DBProvider.tsx` (Supabase initialization)

## ✅ Testing

- [ ] App starts without errors
- [ ] See "Connecting to cloud database..." message on launch
- [ ] No errors in console logs
- [ ] Can create goals (check Supabase Table Editor)
- [ ] Can create daily plans
- [ ] Can toggle tasks
- [ ] Settings are saved
- [ ] Data persists after app restart

## ✅ Verification

### 1. Check Console Logs

Expected logs on app start:
```
Initializing Supabase database...
Created new user: [UUID]  (or) Recreated user: [UUID]
Supabase database initialized successfully
Data loaded into store
```

### 2. Check Supabase Dashboard

1. Go to **Table Editor** → **users**
   - Should see 1 row with your device's user ID

2. Go to **Table Editor** → **settings**
   - Should see 1 row with default settings

3. After adding a goal:
   - Go to **Table Editor** → **goals**
   - Should see your goal

4. After generating a plan:
   - Go to **Table Editor** → **plans**
   - Should see today's plan
   - Go to **Table Editor** → **tasks**
   - Should see tasks for the plan

### 3. Test Data Persistence

1. Add a goal in the app
2. Close and restart the app
3. Goal should still be there ✓

## ✅ Clean Up (Optional)

- [ ] Delete `services/database.mobile.ts` (no longer used)
- [ ] Remove `expo-sqlite` from `package.json` (if not needed)
- [ ] Update any custom code that uses the old database

## 🔧 Troubleshooting

### Error: Missing Supabase environment variables

**Solution:**
1. Verify `.env` file exists in project root
2. Check variable names are exactly:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_KEY`
3. Restart dev server: `npm start`

### Error: Database initialization timeout

**Solution:**
1. Check internet connection
2. Verify Supabase API key is correct
3. Check Supabase project is active (not paused)

### Error: relation "users" does not exist

**Solution:**
1. Run the migration SQL in Supabase Dashboard
2. Verify tables exist in Table Editor

### Error: Insert/Update/Delete permissions denied

**Solution:**
1. Check RLS policies in Supabase Dashboard
2. Migration script includes permissive policies
3. Make sure you ran the complete migration

### Data not appearing in Supabase

**Solution:**
1. Check console for errors
2. Verify network requests in browser DevTools
3. Check Supabase Logs: Settings → Logs → API Logs

## 📝 Migration Notes

### Breaking Changes

The store actions are now **async**. Update your code:

**Before:**
```typescript
const { addGoal, setSettings } = useCoach();

addGoal('My goal');
setSettings({ locale: 'fr' });
```

**After:**
```typescript
const { addGoal, setSettings } = useCoach();

await addGoal('My goal');
await setSettings({ locale: 'fr' });
```

### New Features Available

- ✅ Cloud sync for all data
- ✅ Data persists across reinstalls
- ✅ Ready for multi-user features
- ✅ Real-time updates (with Supabase Realtime)
- ✅ Better scalability

### Data Migration

**Important:** This setup creates a new database. Old SQLite data is not automatically migrated.

If you have existing data to migrate:
1. Export from SQLite before migration
2. Import into Supabase using the dashboard or API
3. Or provide a migration script

## ✅ Post-Migration

- [ ] Test all app features
- [ ] Verify data in Supabase Dashboard
- [ ] Update documentation if needed
- [ ] Consider adding authentication for production
- [ ] Consider implementing offline mode

## 🎉 Migration Complete!

Your app is now powered by Supabase! 

Next steps:
- [ ] Add user authentication (optional)
- [ ] Enable Realtime subscriptions (optional)
- [ ] Set up production RLS policies
- [ ] Configure backups in Supabase
- [ ] Monitor usage in Supabase Dashboard

## Need Help?

- 📚 [Full Setup Guide](./SUPABASE_SETUP.md)
- 🚀 [Quick Start](./QUICKSTART_SUPABASE.md)
- 📖 [Supabase Docs](https://supabase.com/docs)
- 💬 [Supabase Discord](https://discord.supabase.com)

