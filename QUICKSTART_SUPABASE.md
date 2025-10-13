# Supabase Quick Start

Get your AI Daily Motivation Coach app connected to Supabase in 5 minutes!

## 1️⃣ Get Supabase Credentials

Your Supabase URL is already configured:
```
https://lhommbfjfruiekqukqvc.supabase.co
```

You need to add your API key:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project
3. Go to **Settings** → **API**
4. Copy the **anon/public** key

## 2️⃣ Create .env File

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://lhommbfjfruiekqukqvc.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=paste_your_anon_key_here
```

## 3️⃣ Create Database Tables

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New query**
3. Copy all contents from `supabase/migrations/001_initial_schema.sql`
4. Paste into the editor
5. Click **Run** (or press Ctrl+Enter)

✅ You should see "Success. No rows returned" message

## 4️⃣ Verify Tables Created

Go to **Table Editor** and verify these tables exist:
- ✅ users
- ✅ settings
- ✅ goals
- ✅ plans
- ✅ tasks

## 5️⃣ Run Your App

```bash
npm start
```

That's it! Your app is now connected to Supabase 🎉

## Testing

The app will:
1. Automatically create a user on first launch
2. Save all goals, plans, and settings to Supabase
3. Sync data across app restarts

## Troubleshooting

**"Missing Supabase environment variables"**
→ Make sure `.env` file exists and restart dev server

**"relation 'users' does not exist"**
→ Run the migration SQL script (Step 3)

**"Database initialization timeout"**
→ Check internet connection and Supabase API key

## What's Different?

### Before (AsyncStorage)
- Data stored locally only
- Lost on app uninstall
- No cloud backup

### After (Supabase)
- Data stored in the cloud ☁️
- Syncs automatically
- Persists across devices (with auth)
- Ready for multi-user features

## Need Help?

Check the full setup guide: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

