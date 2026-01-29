# Timer System Integration Guide

## Overview
This guide explains how the **timer-system** is integrated into **StudyFlow** for unified duration tracking and session management.

---

## Architecture

### Components

#### 1. **DurationTracker** (`utils/durationTracker.js`)
Core duration tracking utility that manages:
- Session lifecycle (start, pause, resume, end)
- Accurate millisecond-based duration calculation
- Session persistence via localStorage
- Today's statistics aggregation
- Session analytics and export

**Key Methods:**
```javascript
tracker.startSession(subject, notes)     // Start new session
tracker.pauseSession()                   // Pause current
tracker.resumeSession()                  // Resume paused
tracker.endSession()                     // End and save
tracker.getCurrentDuration()             // Get HH:MM:SS
tracker.getTodayStats()                  // Get today's stats
tracker.exportSessions()                 // Export as JSON
```

#### 2. **TimerSystemBridge** (`utils/timerSystemBridge.js`)
Integration bridge that:
- Connects StudyTimer with DurationTracker
- Syncs timer events (start, pause, resume, stop)
- Provides analytics and reporting
- Handles data export (JSON, CSV)

**Key Methods:**
```javascript
bridge.getCurrentDuration()              // Get current duration
bridge.getTodayStats()                   // Get today's stats
bridge.exportData('json'|'csv')          // Export data
bridge.getAnalytics()                    // Get analytics
```

---

## Integration Steps

### Step 1: Include Scripts
In `public/timer/index.html`, add these scripts **before** `timer.js`:

```html
<script src="../../../utils/durationTracker.js"></script>
<script src="../../../utils/timerSystemBridge.js"></script>
<script src="js/timer.js"></script>
```

### Step 2: Initialize in JavaScript
In `public/timer/js/timer.js`, add after StudyTimer initialization:

```javascript
// Initialize tracker and bridge
const durationTracker = new DurationTracker();
const timerBridge = new TimerSystemBridge(timer, durationTracker);

// Access anywhere:
// timerBridge.getCurrentDuration()
// timerBridge.getTodayStats()
// timerBridge.getAnalytics()
```

### Step 3: Update UI to Use Duration Data
Use the bridge in your UI to display:
- Current session duration
- Today's statistics
- Session analytics

```javascript
// Update duration display
setInterval(() => {
  const duration = timerBridge.getCurrentDuration();
  document.getElementById('currentDuration').textContent = duration;
}, 1000);

// Display today's stats
const stats = timerBridge.getTodayStats();
console.log(`Sessions: ${stats.sessionsCount}`);
console.log(`Total Time: ${stats.totalDurationFormatted}`);
```

---

## Data Model

### Session Object
```javascript
{
  id: 'session_1705098400000_abc123def',
  subject: 'Mathematics',
  notes: 'Algebra homework',
  startTime: 1705098400000,                    // Unix timestamp
  startTimeFormatted: '2:30:45 PM',
  endTime: 1705102000000,
  endTimeFormatted: '3:46:40 PM',
  duration: 3600000,                           // Milliseconds
  durationFormatted: '01:00:00',               // HH:MM:SS
  status: 'completed',                         // active|paused|completed
  createdAt: '2024-01-13T14:30:00.000Z'
}
```

### Statistics Object
```javascript
{
  sessionsCount: 5,
  totalDuration: 18000000,                     // 5 hours in ms
  totalDurationFormatted: '5h 0m',
  avgDuration: 3600000,
  avgDurationFormatted: '1h',
  sessions: [...]                              // Array of session objects
}
```

### Analytics Object
```javascript
{
  totalSessions: 25,
  totalDuration: 90000000,                     // Total in ms
  todayStats: {...},                           // Today's statistics
  subjectBreakdown: {
    Mathematics: {
      count: 10,
      totalDuration: 36000000,
      sessions: [...]
    },
    ...
  },
  dailyStats: {
    'Sat Jan 13 2024': 18000000,
    'Sun Jan 14 2024': 21600000,
    ...
  },
  averageSessionDuration: 3600000
}
```

---

## Features

### Duration Calculation
- **Accurate:** Uses `Date.now()` timestamps, not interval counting
- **Pause Support:** Properly handles pause/resume cycles
- **Persistent:** Auto-saves to localStorage
- **Formatted:** Provides both HH:MM:SS and human-readable formats

### Session Management
- **Create:** Start new session with subject & notes
- **Control:** Pause, resume, or stop at any time
- **Persist:** Auto-saves all sessions to localStorage
- **Query:** Filter by date, subject, or time range
- **Delete:** Remove individual sessions or clear all

### Analytics
- **Today's Stats:** Sessions count, total time, average duration
- **Subject Breakdown:** Track time spent per subject
- **Daily Trends:** See productivity patterns
- **Export:** Download as JSON or CSV

---

## Usage Examples

### Example 1: Basic Session Tracking
```javascript
const tracker = new DurationTracker();

// Start session
tracker.startSession('Mathematics', 'Chapter 5');

// ... User studies ...

// End session
const completedSession = tracker.endSession();
console.log(`Completed: ${completedSession.durationFormatted}`);
```

### Example 2: Get Today's Summary
```javascript
const stats = tracker.getTodayStats();
console.log(`Total sessions today: ${stats.sessionsCount}`);
console.log(`Total time: ${stats.totalDurationFormatted}`);
console.log(`Average per session: ${stats.avgDurationFormatted}`);
```

### Example 3: Export Data
```javascript
const tracker = new DurationTracker();
const bridge = new TimerSystemBridge(timer, tracker);

// Export as JSON
const jsonData = bridge.exportData('json');
// Save to file or send to server

// Export as CSV
const csvData = bridge.exportData('csv');
// Download or share
```

### Example 4: Analytics
```javascript
const analytics = bridge.getAnalytics();

console.log(`Total study time: ${Math.round(analytics.totalDuration / 3600000)} hours`);
console.log(`Top subject: ${Object.keys(analytics.subjectBreakdown)[0]}`);

Object.entries(analytics.subjectBreakdown).forEach(([subject, data]) => {
  console.log(`${subject}: ${Math.round(data.totalDuration / 60000)} minutes`);
});
```

---

## Browser Storage

### localStorage Keys
- **`studyflow_sessions`** - Array of all sessions (JSON)

### Limits
- localStorage typically supports ~5-10MB per domain
- For large datasets (>1000 sessions), consider server-side storage

---

## Integration with StudyFlow API

### Sending Sessions to Server
```javascript
async function saveSessions() {
  const sessions = tracker.getAllSessions();
  
  const response = await fetch('/api/sessions/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessions })
  });
  
  return response.json();
}
```

### Loading Sessions from Server
```javascript
async function loadServerSessions() {
  const response = await fetch('/api/sessions/load');
  const { sessions } = await response.json();
  
  // Import to local tracker
  tracker.importSessions(JSON.stringify(sessions));
}
```

---

## Performance Considerations

### Optimization Tips
1. **Batch Updates:** Update UI every 1000ms, not on every duration change
2. **localStorage Limits:** Archive old sessions to server periodically
3. **Memory:** For sessions >500, consider pagination
4. **Calculations:** Cache analytics results, recalculate on session end

### Example Optimization
```javascript
let lastUIUpdate = 0;
const UI_UPDATE_INTERVAL = 1000;

function updateUI() {
  const now = Date.now();
  
  if (now - lastUIUpdate >= UI_UPDATE_INTERVAL) {
    const duration = tracker.getCurrentDuration();
    document.getElementById('timer').textContent = duration;
    lastUIUpdate = now;
  }
  
  requestAnimationFrame(updateUI);
}

updateUI();
```

---

## Troubleshooting

### Sessions Not Persisting
- Check if localStorage is enabled in browser
- Verify no browser storage quota errors
- Check DevTools Console for errors

### Duration Inaccuracies
- Ensure timestamps use `Date.now()` not `new Date()`
- Verify pause/resume logic is working
- Check for page visibility events interfering

### Bridge Not Working
- Ensure both tracker and timer instances exist
- Verify timer methods (start, stop, pause, resume) are implemented
- Check console for initialization errors

---

## API Reference

### DurationTracker Methods

#### `startSession(subject, notes)`
Starts a new study session.
- Returns: Session object

#### `pauseSession()`
Pauses current session.
- Returns: Current session

#### `resumeSession()`
Resumes paused session.
- Returns: Current session

#### `endSession()`
Ends and saves current session.
- Returns: Completed session

#### `getCurrentDuration()`
Gets current session duration in HH:MM:SS format.
- Returns: String

#### `getCurrentDurationMs()`
Gets current session duration in milliseconds.
- Returns: Number

#### `getTodayStats()`
Gets today's aggregated statistics.
- Returns: Statistics object

#### `getAllSessions()`
Gets all recorded sessions.
- Returns: Array of session objects

#### `getSessionsByDate(date)`
Gets sessions for a specific date.
- Parameters: Date object
- Returns: Array of session objects

#### `deleteSession(sessionId)`
Deletes a specific session.
- Parameters: Session ID string
- Returns: Boolean

#### `clearAllSessions()`
Clears all sessions.

#### `exportSessions()`
Exports all sessions as JSON string.
- Returns: JSON string

#### `importSessions(jsonData)`
Imports sessions from JSON string.
- Parameters: JSON string
- Returns: Boolean

#### `formatDuration(ms)`
Formats milliseconds to HH:MM:SS.
- Parameters: Milliseconds (number)
- Returns: Formatted string

#### `formatDurationReadable(ms)`
Formats milliseconds to readable text.
- Parameters: Milliseconds (number)
- Returns: Readable string (e.g., "1h 30m 45s")

---

## Best Practices

1. **Always initialize bridge after timer instance is ready**
2. **Use HH:MM:SS format for user display**
3. **Store formatted times separately for consistency**
4. **Regularly backup sessions to server**
5. **Handle localStorage errors gracefully**
6. **Use analytics for insights, not just tracking**

---

## Support & Issues

For issues or feature requests:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify integration steps are complete
4. Check localStorage availability

---

**Version:** 1.0.0  
**Last Updated:** January 2024  
**Status:** Production Ready ✅
