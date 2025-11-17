# Calorie Tracker Setup Guide

## ✅ What's Been Added

1. **Database Table**: `calorie_entries` table in Supabase
2. **New Screen**: `CalorieTrackerScreen` with daily tracking and graphs
3. **Navigation**: New "Calories" tab in the bottom navigation
4. **Functions**: Calorie tracking functions added to AppContext

## 🔧 Setup Steps

### Step 1: Update Database Schema

1. Go to your Supabase Dashboard: https://jkbekdqfbfpelujeawwc.supabase.co
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Open the `supabase-schema.sql` file in your project
5. Scroll to the bottom and copy the new `calorie_entries` table creation code (lines 87-125)
6. Paste it into the SQL Editor
7. Click **"Run"** (or press Cmd/Ctrl + Enter)
8. You should see: ✅ "Success. No rows returned"

### Step 2: Verify Table Created

1. In Supabase dashboard, go to **"Table Editor"** in the left sidebar
2. You should see a new table: ✅ `calorie_entries`

### Step 3: Restart Your App

```bash
# Stop current server (Ctrl+C)
npm run dev
# or
npx expo start
```

## 📱 Features

### Daily Tracking
- Enter calories consumed for any date
- View today's calorie count
- Save/update daily calorie entries

### Monthly View
- Line graph showing calories consumed over the last 30 days
- Automatically fills in missing dates with 0 calories

### Yearly View
- Line graph showing monthly average calories for the current year
- Shows all 12 months with average daily calories per month

## 🔒 Privacy & Security

- **User-Specific**: All calorie data is filtered by `user_id`
- **Guest Users**: Cannot access calorie tracking (must be logged in)
- **Database**: All data is stored in Supabase `calorie_entries` table
- **RLS Policies**: Row Level Security enabled (app filters by user_id)

## 📊 Data Structure

Each calorie entry contains:
- `user_id`: The logged-in user's ID
- `user_email`: User's email
- `date`: Date in YYYY-MM-DD format
- `calories`: Number of calories consumed
- `created_at`: Timestamp when entry was created
- `updated_at`: Timestamp when entry was last updated

## 🎯 Usage

1. **Log in** to your account (guest users cannot track calories)
2. Navigate to the **"Calories"** tab
3. **Day View**: Enter calories for today or any date
4. **Month View**: See your last 30 days of calorie consumption
5. **Year View**: See your monthly averages for the year

## 🐛 Troubleshooting

**"Please log in to track your calories" message:**
- You must be logged in (not a guest) to use calorie tracking
- Click "Login" and enter any email/password

**Graphs not showing:**
- Make sure you've entered some calorie data first
- Check that the database table was created successfully
- Verify your Supabase credentials in `.env` file

**Data not saving:**
- Check your internet connection
- Verify Supabase URL and key in `.env` file
- Check browser console for errors (F12)

## 📝 Notes

- One entry per user per day (updates existing entry if you save again for the same date)
- Monthly view shows last 30 days from today
- Yearly view shows current year (January to December)
- All data is private to each user


