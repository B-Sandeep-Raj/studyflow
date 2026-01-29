@echo off
REM StudyFlow Timer System Integration Setup Script
REM Initializes timer system integration for duration tracking

echo.
echo 📦 StudyFlow Timer System Integration Setup
echo ===========================================
echo.

REM Check if utils directory exists
if not exist "utils" (
    echo ✅ Creating utils directory...
    mkdir utils
) else (
    echo ✅ Utils directory already exists
)

REM Check if integration files exist
if exist "utils\durationTracker.js" (
    echo ✅ Timer system integration files found
) else (
    echo ⚠️  Timer system files not found. Please ensure files are in utils\
)

REM Check if integration guide exists
if exist "TIMER_SYSTEM_INTEGRATION.md" (
    echo ✅ Integration guide found
) else (
    echo ⚠️  Integration guide not found
)

echo.
echo 🔧 Setup Instructions:
echo =====================
echo.
echo 1. Include scripts in public\timer\index.html (before timer.js):
echo    ^<script src="....\..\utils\durationTracker.js"^>^</script^>
echo    ^<script src="....\..\utils\timerSystemBridge.js"^>^</script^>
echo    ^<script src="js\timer.js"^>^</script^>
echo.
echo 2. Initialize in public\timer\js\timer.js after timer initialization:
echo    const durationTracker = new DurationTracker();
echo    const timerBridge = new TimerSystemBridge(timer, durationTracker);
echo.
echo 3. Access tracking features:
echo    timerBridge.getCurrentDuration()    // Get HH:MM:SS
echo    timerBridge.getTodayStats()         // Get today's stats
echo    timerBridge.getAnalytics()          // Get analytics
echo.
echo 📖 For detailed info, see: TIMER_SYSTEM_INTEGRATION.md
echo.
echo ✅ Setup Complete!
pause
