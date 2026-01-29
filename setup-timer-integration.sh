#!/bin/bash

# StudyFlow Timer System Integration Setup Script
# Initializes timer system integration for duration tracking

echo "📦 StudyFlow Timer System Integration Setup"
echo "==========================================="
echo ""

# Check if utils directory exists
if [ ! -d "utils" ]; then
    echo "✅ Creating utils directory..."
    mkdir -p utils
else
    echo "✅ Utils directory already exists"
fi

# Check if integration files exist
if [ -f "utils/durationTracker.js" ] && [ -f "utils/timerSystemBridge.js" ]; then
    echo "✅ Timer system integration files found"
else
    echo "⚠️  Timer system files not found. Please ensure durationTracker.js and timerSystemBridge.js are in utils/"
fi

# Check if integration guide exists
if [ -f "TIMER_SYSTEM_INTEGRATION.md" ]; then
    echo "✅ Integration guide found"
else
    echo "⚠️  Integration guide not found"
fi

echo ""
echo "🔧 Setup Instructions:"
echo "====================="
echo ""
echo "1. Include scripts in public/timer/index.html (before timer.js):"
echo "   <script src=\"../../../utils/durationTracker.js\"></script>"
echo "   <script src=\"../../../utils/timerSystemBridge.js\"></script>"
echo "   <script src=\"js/timer.js\"></script>"
echo ""
echo "2. Initialize in public/timer/js/timer.js after timer initialization:"
echo "   const durationTracker = new DurationTracker();"
echo "   const timerBridge = new TimerSystemBridge(timer, durationTracker);"
echo ""
echo "3. Access tracking features:"
echo "   timerBridge.getCurrentDuration()    // Get HH:MM:SS"
echo "   timerBridge.getTodayStats()         // Get today's stats"
echo "   timerBridge.getAnalytics()          // Get analytics"
echo ""
echo "📖 For detailed info, see: TIMER_SYSTEM_INTEGRATION.md"
echo ""
echo "✅ Setup Complete!"
