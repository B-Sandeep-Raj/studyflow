/* ═══════════════════════════════════════════════════════════════════════════
   TIMER SYSTEM INTEGRATION MODULE
   Bridge between timer-system and studyflow for unified duration tracking
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * TimerSystemBridge
 * Integrates timer-system functionality with studyflow's StudyTimer
 */
class TimerSystemBridge {
  constructor(studyTimerInstance, durationTrackerInstance) {
    this.timer = studyTimerInstance;
    this.tracker = durationTrackerInstance;
    this.isIntegrated = false;

    this.initialize();
  }

  /**
   * Initialize the bridge
   */
  initialize() {
    if (!this.timer || !this.tracker) {
      console.warn('⚠️  Timer or Tracker instance missing. Bridge not initialized.');
      return;
    }

    this.hookTimerEvents();
    this.syncWithTracker();
    this.isIntegrated = true;

    console.log('✅ Timer System Bridge initialized');
  }

  /**
   * Hook into timer events
   * @private
   */
  hookTimerEvents() {
    // Override timer start method
    const originalStart = this.timer.start.bind(this.timer);
    this.timer.start = () => {
      originalStart();
      this.onTimerStart();
    };

    // Override timer pause method
    const originalPause = this.timer.pause ? this.timer.pause.bind(this.timer) : null;
    if (originalPause) {
      this.timer.pause = () => {
        originalPause();
        this.onTimerPause();
      };
    }

    // Override timer resume method
    const originalResume = this.timer.resume ? this.timer.resume.bind(this.timer) : null;
    if (originalResume) {
      this.timer.resume = () => {
        originalResume();
        this.onTimerResume();
      };
    }

    // Override timer stop method
    const originalStop = this.timer.stop ? this.timer.stop.bind(this.timer) : null;
    if (originalStop) {
      this.timer.stop = () => {
        const result = originalStop();
        this.onTimerStop();
        return result;
      };
    }

    console.log('🔗 Timer events hooked');
  }

  /**
   * Sync tracker with timer data
   * @private
   */
  syncWithTracker() {
    // Sync subject from timer input
    const subject = this.timer.elements?.subjectInput?.value || 'General Study';
    const notes = this.timer.elements?.notesInput?.value || '';

    if (this.tracker.currentSession) {
      this.tracker.currentSession.subject = subject;
      this.tracker.currentSession.notes = notes;
    }

    console.log('🔄 Tracker synced with timer data');
  }

  /**
   * Handle timer start event
   * @private
   */
  onTimerStart() {
    const subject = this.timer.elements?.subjectInput?.value || 'General Study';
    const notes = this.timer.elements?.notesInput?.value || '';

    // Start session in tracker
    this.tracker.startSession(subject, notes);

    console.log('⏱️  Duration tracking started');
  }

  /**
   * Handle timer pause event
   * @private
   */
  onTimerPause() {
    if (this.tracker.isRunning) {
      this.tracker.pauseSession();
      console.log('⏸️  Duration tracking paused');
    }
  }

  /**
   * Handle timer resume event
   * @private
   */
  onTimerResume() {
    if (this.tracker.isPaused) {
      this.tracker.resumeSession();
      console.log('▶️  Duration tracking resumed');
    }
  }

  /**
   * Handle timer stop event
   * @private
   */
  onTimerStop() {
    if (this.tracker.isRunning) {
      const endedSession = this.tracker.endSession();
      console.log('✔️  Duration tracking ended:', endedSession);
    }
  }

  /**
   * Get current duration from tracker
   * @returns {string} Formatted duration HH:MM:SS
   */
  getCurrentDuration() {
    return this.tracker.getCurrentDuration();
  }

  /**
   * Get today's statistics
   * @returns {Object} Statistics object
   */
  getTodayStats() {
    return this.tracker.getTodayStats();
  }

  /**
   * Export session data
   * @param {string} format - Export format (json, csv)
   * @returns {string} Exported data
   */
  exportData(format = 'json') {
    if (format === 'json') {
      return this.tracker.exportSessions();
    } else if (format === 'csv') {
      return this.generateCSV();
    }
    return '';
  }

  /**
   * Generate CSV export
   * @private
   * @returns {string} CSV data
   */
  generateCSV() {
    const headers = ['Session ID', 'Subject', 'Start Time', 'End Time', 'Duration', 'Notes'];
    const rows = this.tracker.sessions.map((session) => [
      session.id,
      session.subject,
      session.startTimeFormatted || '',
      session.endTimeFormatted || '',
      session.durationFormatted || '',
      `"${session.notes || ''}"`,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }

  /**
   * Get session analytics
   * @returns {Object} Analytics data
   */
  getAnalytics() {
    const allSessions = this.tracker.getAllSessions();
    const todayStats = this.tracker.getTodayStats();

    // Calculate subject-wise breakdown
    const subjectBreakdown = {};
    allSessions.forEach((session) => {
      if (!subjectBreakdown[session.subject]) {
        subjectBreakdown[session.subject] = {
          count: 0,
          totalDuration: 0,
          sessions: [],
        };
      }
      subjectBreakdown[session.subject].count += 1;
      subjectBreakdown[session.subject].totalDuration += session.duration || 0;
      subjectBreakdown[session.subject].sessions.push(session);
    });

    // Calculate streaks
    const dailyStats = {};
    allSessions.forEach((session) => {
      const date = new Date(session.createdAt).toDateString();
      if (!dailyStats[date]) {
        dailyStats[date] = 0;
      }
      dailyStats[date] += session.duration || 0;
    });

    return {
      totalSessions: allSessions.length,
      totalDuration: allSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
      todayStats: todayStats,
      subjectBreakdown: subjectBreakdown,
      dailyStats: dailyStats,
      averageSessionDuration:
        allSessions.length > 0
          ? allSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / allSessions.length
          : 0,
    };
  }
}

// Export for use in browsers and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TimerSystemBridge;
}
