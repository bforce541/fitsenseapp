# 🚀 FitSense - Quick Start Guide

## ✅ Step 1: Verify Your Environment File

Your `.env` file should already have:
- ✅ OpenAI API key
- ✅ Supabase URL: `https://jkbekdqfbfpelujeawwc.supabase.co`
- ✅ Supabase Anon Key

**Check it:**
```bash
cat .env
```

If anything is missing, add it to `.env` file.

---

## ✅ Step 2: Set Up Supabase Database (ONE TIME)

### 2.1 Go to Supabase Dashboard
- Visit: https://jkbekdqfbfpelujeawwc.supabase.co
- Log in to your Supabase account

### 2.2 Run the Database Schema
1. Click **"SQL Editor"** in left sidebar
2. Click **"New query"**
3. Open `supabase-schema.sql` file in your project
4. **Copy ALL the SQL code** from that file
5. **Paste** into SQL Editor
6. Click **"Run"** (or press Cmd/Ctrl + Enter)
7. You should see: ✅ "Success. No rows returned"

### 2.3 Verify Tables Were Created
1. Click **"Table Editor"** in left sidebar
2. You should see 3 tables:
   - ✅ `questions`
   - ✅ `votes`
   - ✅ `user_stats`

---

## ✅ Step 3: Install Dependencies

```bash
npm install
```

---

## ✅ Step 4: Start the App

```bash
npx expo start
```

This will:
- Start the Expo development server
- Show a QR code
- Open Expo DevTools in your browser

---

## ✅ Step 5: Run on Your Device

### Option A: iOS Simulator (Mac only)
- Press `i` in the terminal
- iOS Simulator will open automatically

### Option B: Android Emulator
- Press `a` in the terminal
- Android Emulator will open (if installed)

### Option C: Physical Device
1. Install **Expo Go** app on your phone:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Scan the QR code shown in terminal
3. App will load on your phone

---

## ✅ Step 6: Test the App

### Test Flow:
1. **Login Screen**
   - Enter email/password OR
   - Click "Continue as Guest"

2. **Ask AI Screen**
   - Type a fitness question OR
   - Click a preset question
   - Click "Ask AI"
   - Wait for AI response (should appear below)

3. **Trending Screen**
   - See all questions sorted by supports
   - Vote on questions (👍 Support / 👎 Don't Support)

4. **Profile Screen**
   - Check your stats (questions asked, supports given)

5. **Settings Screen**
   - Toggle notifications, dark mode, privacy

### Verify Supabase Connection:
1. Ask a question in the app
2. Go to Supabase Dashboard → Table Editor → `questions` table
3. Your question should appear there! ✅

---

## 🐛 Troubleshooting

### "Failed to fetch" or "Network error"
- ✅ Check `.env` file has correct Supabase URL and key
- ✅ Restart Expo server: `npx expo start`
- ✅ Make sure you ran the SQL schema in Supabase

### "relation does not exist"
- ✅ You need to run `supabase-schema.sql` in Supabase SQL Editor
- ✅ Check Table Editor shows 3 tables

### App won't start
- ✅ Make sure you ran `npm install`
- ✅ Check Node.js version: `node --version` (should be v14+)
- ✅ Try clearing cache: `npx expo start -c`

### OpenAI not working
- ✅ Check `.env` has `OPENAI_API_KEY` set
- ✅ Verify your API key is valid
- ✅ Restart Expo server after adding key

---

## 📱 What to Test

- [ ] Login with email/password
- [ ] Continue as guest
- [ ] Ask a custom question
- [ ] Use preset questions
- [ ] See AI response
- [ ] Vote on a question (Support/Don't Support)
- [ ] Check Trending screen
- [ ] View Profile stats
- [ ] Change Settings
- [ ] Verify question appears in Supabase

---

## 🎉 You're Done!

Once everything is working:
- Questions sync to Supabase ✅
- Votes are tracked ✅
- User stats are saved ✅
- Real-time updates work ✅

Enjoy your FitSense app! 🏋️‍♂️

