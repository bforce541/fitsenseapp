#!/bin/bash
# Start FitSense app on localhost with tunnel mode for better connectivity

cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Installing dependencies..."
    npm install
fi

# Start Expo with tunnel mode for better connectivity
echo "🚀 Starting FitSense on localhost..."
echo "📱 Use tunnel mode for better connectivity across networks"
echo ""

npx expo start --tunnel

