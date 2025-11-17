# Fix "Invalid API key" Error

## The Problem
Your `.env` file has a placeholder value for the Supabase API key:
```
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

This needs to be replaced with your actual Supabase anon key.

## Solution: Get Your Real Supabase Anon Key

### Step 1: Go to Your Supabase Dashboard
1. Visit: https://jkbekdqfbfpelujeawwc.supabase.co
2. Log in to your Supabase account

### Step 2: Get Your Anon Key
1. In the left sidebar, click **"Settings"** (gear icon)
2. Click **"API"** in the settings menu
3. You'll see a section called **"Project API keys"**
4. Find the **"anon"** or **"public"** key (it's a long string starting with `eyJ...`)
5. **Copy this entire key**

### Step 3: Update Your .env File
1. Open your `.env` file in the project root
2. Find this line:
   ```
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
3. Replace `your_supabase_anon_key_here` with your actual key:
   ```
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impia2VrZHFmYmZwZWx1amVhd3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk4NzY1MjAsImV4cCI6MjAzNTQ1MjUyMH0.YourActualKeyHere
   ```
   (Use your actual key, not this example!)

### Step 4: Restart Your App
After updating the `.env` file, you MUST restart your Expo server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
# or
npx expo start
```

## Important Notes

- The anon key is safe to use in your app (it's public)
- Never share your "service_role" key (that's secret!)
- The key should be a very long string (hundreds of characters)
- Make sure there are no extra spaces or quotes around the key

## Verify It's Working

After restarting:
1. Try to create an account again
2. The "Invalid API key" error should be gone
3. You should be able to sign up and log in successfully


