# FitSense - AI Fitness Companion

A React Native + Expo mobile app that provides AI-powered fitness and health advice.

## Features

- 🤖 **AI-Powered Answers**: Get instant fitness and health advice using OpenAI GPT-3.5
- 📊 **Trending Answers**: See the most supported answers from the community
- 👍 **Vote System**: Support or don't support answers (one vote per user per question)
- 📈 **User Stats**: Track questions asked and supports given
- ⚙️ **Settings**: Customize notifications, dark mode, and privacy settings
- 👤 **Guest Mode**: Use the app without creating an account

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Emulator, or Expo Go app on your phone

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your OpenAI API key:
   - Open `utils/openai.js`
   - Replace `YOUR_OPENAI_API_KEY` with your actual OpenAI API key

3. Start the development server:
```bash
npx expo start
```

4. Run on your device:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan the QR code with Expo Go app on your phone

## Project Structure

```
FitSenseApp/
├── screens/
│   ├── LoginScreen.js       # Login and guest access
│   ├── AskAIScreen.js       # Ask AI questions
│   ├── ProfileScreen.js     # User profile and stats
│   ├── TrendingScreen.js    # Trending answers
│   └── SettingsScreen.js    # App settings
├── components/
│   ├── QuestionCard.js      # Display question and answer
│   └── VoteButtons.js       # Support/Don't support buttons
├── context/
│   └── AppContext.js        # Global state management
├── utils/
│   └── openai.js            # OpenAI API integration
└── App.js                   # Main app entry point
```

## Usage

1. **Login**: Enter email/password or continue as guest
2. **Ask AI**: Type a fitness question or select from presets
3. **Vote**: Support helpful answers (one vote per question)
4. **Trending**: View top supported answers
5. **Profile**: Check your stats (questions asked, supports given)
6. **Settings**: Customize app preferences

## Technologies Used

- React Native
- Expo
- React Navigation (Stack & Bottom Tabs)
- React Native Paper (UI components)
- Supabase (PostgreSQL database with real-time sync)
- AsyncStorage (local settings storage)
- Axios (API calls)
- OpenAI GPT-3.5 API

## Database Setup

This app uses **Supabase** for cloud database storage. Questions, votes, and user stats are synced across all users.

**Quick Setup:**
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run the SQL schema from `supabase-schema.sql` in Supabase SQL Editor
4. Get your project URL and anon key from Settings → API
5. Add them to your `.env` file

See `SUPABASE_SETUP.md` for detailed instructions.

## Notes

- Questions and votes are stored in Supabase (shared across all users)
- Settings are stored locally using AsyncStorage
- Guest users can use all features (data stored locally for guests)
- Logged-in users have data synced to Supabase
- Vote tracking prevents multiple votes per user per question
- AI responses are limited to 200 words
- Real-time updates when new questions are added

## Next Steps

- 🔑 Add your OpenAI API key and Supabase credentials to `.env`
- 🧠 Customize preset questions in `screens/AskAIScreen.js`
- 📈 Enhance vote tracking and analytics
- ⚙️ Implement dark mode theme
- 🎨 Polish UI/UX

## License

MIT

