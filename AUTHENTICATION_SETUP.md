# Authentication Setup Guide

## ✅ What's Been Implemented

Your app now has **real user authentication** using Supabase Auth! This means:

1. **Real Accounts**: Users can create accounts with email and password
2. **Secure Login**: Users sign in with their credentials
3. **User-Specific Data**: Each user can only see their own:
   - Calorie entries
   - User stats
   - Votes
   - Questions they've asked

## 🔐 How It Works

### Authentication Flow

1. **Sign Up**: New users create an account with email and password
2. **Sign In**: Existing users log in with their credentials
3. **Session Management**: Supabase automatically manages user sessions
4. **Data Isolation**: All database queries filter by the authenticated user's ID

### User Data Privacy

- ✅ **Calorie entries**: Only visible to the user who created them
- ✅ **User stats**: Only visible to the user
- ✅ **Votes**: Only visible to the user who voted
- ✅ **Questions**: Public (shared), but linked to the user who asked

## 📱 Using the App

### For New Users

1. Open the app
2. Click "Don't have an account? Sign Up"
3. Enter your email and password (minimum 6 characters)
4. Click "Sign Up"
5. You'll be automatically logged in

### For Existing Users

1. Open the app
2. Enter your email and password
3. Click "Login"
4. You'll see your personalized data

### Guest Mode

- Users can still use "Continue as Guest"
- Guest users can view public questions and trending
- Guest users **cannot** track calories or save data to their account

## 🔒 Security Features

1. **Password Requirements**: Minimum 6 characters
2. **Session Persistence**: Users stay logged in across app restarts
3. **Automatic Sign Out**: Users can sign out from Profile screen
4. **Data Filtering**: All queries automatically filter by user ID

## 🛠️ Technical Details

### Supabase Auth Integration

- Uses `supabase.auth.signUp()` for registration
- Uses `supabase.auth.signInWithPassword()` for login
- Uses `supabase.auth.signOut()` for logout
- Automatically listens for auth state changes
- Session is persisted automatically

### Database Queries

All queries now filter by `user_id`:
```javascript
.eq('user_id', user.id)
```

This ensures users only see their own data.

## 🐛 Troubleshooting

**"Invalid login credentials" error:**
- Make sure you're using the correct email and password
- Check if you signed up with this email
- Try signing up again if you forgot your password

**"User already registered" error:**
- This email is already in use
- Use "Login" instead of "Sign Up"
- Or use a different email

**Data not showing:**
- Make sure you're logged in (not guest mode)
- Check that you have data saved for your account
- Try signing out and back in

**Can't sign out:**
- Make sure you're logged in (not guest mode)
- Guest users see "Switch to Account" instead of "Log Out"

## 📝 Notes

- **Email Verification**: Currently disabled for easier testing. You can enable it in Supabase dashboard under Authentication → Settings
- **Password Reset**: Not yet implemented. Users need to create a new account if they forget their password
- **Guest Mode**: Still available for users who want to browse without an account

## 🎉 Benefits

✅ **Privacy**: Each user's data is completely private
✅ **Security**: Passwords are securely hashed by Supabase
✅ **Persistence**: Data is saved to the cloud and synced across devices
✅ **Scalability**: Can handle unlimited users
✅ **Real Accounts**: Users have real, persistent accounts


