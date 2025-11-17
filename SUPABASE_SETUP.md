# Supabase Setup Guide for FitSense

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: FitSense (or any name you like)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait 2-3 minutes for the project to be created

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll see:
   - **Project URL** (copy this)
   - **anon/public key** (copy this)

## Step 3: Set Up the Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql` file
4. Paste it into the SQL Editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

## Step 4: Configure Your App

1. Open `.env` file in your project root
2. Add your Supabase credentials:

```env
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

Replace:
- `your-project-id` with your actual Supabase project ID
- `your_anon_key_here` with your actual anon key

## Step 5: Verify Tables Were Created

1. In Supabase dashboard, go to **Table Editor**
2. You should see 3 tables:
   - `questions`
   - `votes`
   - `user_stats`

## Step 6: Test the Connection

1. Restart your Expo dev server:
   ```bash
   npx expo start
   ```

2. Try asking a question in the app
3. Check Supabase **Table Editor** → `questions` table
4. You should see your question appear there!

## What Changed?

✅ **Questions** are now stored in Supabase (shared across all users)
✅ **Votes** are tracked in Supabase (prevents duplicate votes)
✅ **User Stats** are synced to Supabase
✅ **Real-time updates** - new questions appear instantly for all users
✅ **Trending** shows questions from all users, sorted by supports

## Notes

- Guest users can still use the app, but their data is stored locally
- Logged-in users have their data synced to Supabase
- All questions and votes are now shared globally across all app users
- Settings (notifications, dark mode, privacy) are still stored locally

## Troubleshooting

**Error: "Failed to fetch"**
- Check your `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`
- Make sure you restarted the Expo server after adding credentials

**Error: "relation does not exist"**
- Make sure you ran the SQL schema in Supabase SQL Editor
- Check that all 3 tables exist in Table Editor

**Questions not appearing**
- Check Supabase Table Editor to see if data is being saved
- Check browser console for errors
- Verify RLS policies are set correctly (they should allow public access)

