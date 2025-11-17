#!/bin/bash
# Start FitSense app on localhost with LAN mode

cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Installing dependencies..."
    npm install
fi

# Start Expo with LAN mode
echo "🚀 Starting FitSense on localhost (LAN mode)..."
echo "📱 Connect using your local IP address"
echo ""

npx expo start --lan


