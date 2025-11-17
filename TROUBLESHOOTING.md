# Troubleshooting Guide

## iOS Simulator Issues

### Error: "Unable to boot device because we cannot determine the runtime bundle"

**Solution 1: Open Xcode First**
```bash
# Open Xcode (this installs necessary components)
open -a Xcode

# Wait for Xcode to finish setup, then close it
# Then try: npx expo start
```

**Solution 2: Install Xcode Command Line Tools**
```bash
xcode-select --install
```

**Solution 3: Reset Simulator**
```bash
# List available simulators
xcrun simctl list devices

# Boot a specific simulator
xcrun simctl boot "iPhone 14"
```

**Solution 4: Use Alternative**
- Use **Web**: `npx expo start --web`
- Use **Android**: `npx expo start --android` (if Android Studio installed)
- Use **Physical Device**: Scan QR code with Expo Go app

---

## Other Common Issues

### Metro Bundler Won't Start
```bash
# Clear cache and restart
npx expo start -c
```

### Port Already in Use
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9
npx expo start
```

### Dependencies Issues
```bash
# Fix dependency versions
npx expo install --fix

# Or reinstall everything
rm -rf node_modules
npm install
```

---

## Supabase Connection Issues

### "Failed to fetch" Error
- ✅ Check `.env` file has correct Supabase URL and key
- ✅ Make sure you ran the SQL schema in Supabase
- ✅ Restart Expo server after adding credentials

### "relation does not exist"
- ✅ Run `supabase-schema.sql` in Supabase SQL Editor
- ✅ Verify 3 tables exist in Table Editor

---

## Quick Test Without iOS Simulator

1. **Web Version** (Easiest):
   ```bash
   npx expo start --web
   ```

2. **Physical Device**:
   - Install Expo Go app
   - Run `npx expo start`
   - Scan QR code with your phone

3. **Android Emulator** (if installed):
   ```bash
   npx expo start --android
   ```

