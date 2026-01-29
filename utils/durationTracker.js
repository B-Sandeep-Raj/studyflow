/* ═══════════════════════════════════════════════════════════════════════════
   DURATION TRACKER - Timer System Integration
   Unified duration tracking for StudyFlow
   Integrates timer-system with studyflow for accurate session tracking
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * DurationTracker Class
 * Handles session duration calculation and tracking
 * Works with both timer-system and studyflow timer implementations
 */
class DurationTracker {
  constructor() {
    this.sessions = [];
    this.currentSession = null;
    this.sessionStartTime = null;
    this.pausedDuration = 0;
    this.isRunning = false;
    this.isPaused = false;
    
    // Load existing sessions
    this.loadSessions();
  }

  /**
   * Start a new study session
   * @param {string} subject - Subject being studied
   * @param {string} notes - Session notes
   * @returns {Object} Current session object
   */
  startSession(subject = 'General Study', notes = '') {
    if (this.isRunning && !this.isPaused) {
      console.warn('⚠️  Session already running');
      return this.currentSession;
    }

    this.isRunning = true;
    this.isPaused = false;
    this.pausedDuration = 0;

    const now = Date.now();
    this.sessionStartTime = now;

    this.currentSession = {
      id: this.generateSessionId(),
      subject: subject || 'General Study',
      notes: notes || '',
      startTime: now,
      startTimeFormatted: new Date(now).toLocaleTimeString(),
      endTime: null,
      duration: 0, // in milliseconds
      durationFormatted: '0h 0m 0s',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    this.saveSessions(); // Persist immediately
    console.log('✅ Session started:', this.currentSession.subject);
    return this.currentSession;
  }

  /**
   * Pause current session
   * @returns {Object} Current session with updated duration
   */
  pauseSession() {
    if (!this.isRunning || this.isPaused) {
      console.warn('⚠️  No active session to pause');
      return this.currentSession;
    }

    this.isPaused = true;
    this.pausedDuration += Date.now() - this.sessionStartTime;
    this.currentSession.status = 'paused';
    this.currentSession = this.updateDuration(this.currentSession);

    console.log('⏸️  Session paused');
    return this.currentSession;
  }

  /**
   * Resume paused session
   * @returns {Object} Resumed session
   */
  resumeSession() {
    if (!this.isRunning || !this.isPaused) {
      console.warn('⚠️  No paused session to resume');
      return this.currentSession;
    }

    this.isPaused = false;
    this.sessionStartTime = Date.now();
    this.currentSession.status = 'active';

    console.log('▶️  Session resumed');
    return this.currentSession;
  }

  /**
   * End current session
   * @returns {Object} Completed session
   */
  endSession() {
    if (!this.isRunning) {
      console.warn('⚠️  No active session to end');
      return null;
    }

    const endTime = Date.now();

    // Calculate total duration
    if (!this.isPaused) {
      this.pausedDuration += endTime - this.sessionStartTime;
    }

    this.currentSession.endTime = endTime;
    this.currentSession.endTimeFormatted = new Date(endTime).toLocaleTimeString();
    this.currentSession.duration = this.pausedDuration;
    this.currentSession.durationFormatted = this.formatDuration(this.pausedDuration);
    this.currentSession.status = 'completed';

    // Add to sessions array
    this.sessions.push(this.currentSession);
    this.saveSessions();

    // Reset state
    this.isRunning = false;
    this.isPaused = false;
    this.pausedDuration = 0;
    this.sessionStartTime = null;

    console.log('✔️  Session ended:', this.currentSession.subject);
    console.log('📊 Duration:', this.currentSession.durationFormatted);

    return this.currentSession;
  }

  /**
   * Get current session duration
   * @returns {string} Formatted duration string
   */
  getCurrentDuration() {
    if (!this.isRunning) {
      return '0h 0m 0s';
    }

    let elapsed = this.pausedDuration;
    if (!this.isPaused) {
      elapsed += Date.now() - this.sessionStartTime;
    }

    return this.formatDuration(elapsed);
  }

  /**
   * Get current session duration in milliseconds
   * @returns {number} Duration in ms
   */
  getCurrentDurationMs() {
    if (!this.isRunning) {
      return 0;
    }

    let elapsed = this.pausedDuration;
    if (!this.isPaused) {
      elapsed += Date.now() - this.sessionStartTime;
    }

    return elapsed;
  }

  /**
   * Update duration on current session
   * @param {Object} session - Session to update
   * @returns {Object} Updated session
   */
  updateDuration(session) {
    if (this.isRunning && session.id === this.currentSession.id) {
      const duration = this.getCurrentDurationMs();
      session.duration = duration;
      session.durationFormatted = this.formatDuration(duration);
    }
    return session;
  }

  /**
   * Format milliseconds to HH:MM:SS format
   * @param {number} ms - Milliseconds
   * @returns {string} Formatted duration
   */
  formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  /**
   * Format duration to readable text
   * @param {number} ms - Milliseconds
   * @returns {string} Human-readable duration
   */
  formatDurationReadable(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);

    return parts.length > 0 ? parts.join(' ') : '0s';
  }

  /**
   * Get today's statistics
   * @returns {Object} Statistics object
   */
  getTodayStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = this.sessions.filter((session) => {
      const sessionDate = new Date(session.createdAt);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });

    const totalDuration = todaySessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const avgDuration = todaySessions.length > 0 ? totalDuration / todaySessions.length : 0;

    return {
      sessionsCount: todaySessions.length,
      totalDuration: totalDuration,
      totalDurationFormatted: this.formatDurationReadable(totalDuration),
      avgDuration: avgDuration,
      avgDurationFormatted: this.formatDurationReadable(avgDuration),
      sessions: todaySessions,
    };
  }

  /**
   * Get all sessions
   * @returns {Array} All sessions
   */
  getAllSessions() {
    return this.sessions;
  }

  /**
   * Get sessions for a specific date
   * @param {Date} date - Target date
   * @returns {Array} Sessions for that date
   */
  getSessionsByDate(date) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return this.sessions.filter((session) => {
      const sessionDate = new Date(session.createdAt);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === targetDate.getTime();
    });
  }

  /**
   * Delete a session
   * @param {string} sessionId - Session ID to delete
   * @returns {boolean} Success flag
   */
  deleteSession(sessionId) {
    const index = this.sessions.findIndex((s) => s.id === sessionId);
    if (index !== -1) {
      this.sessions.splice(index, 1);
      this.saveSessions();
      return true;
    }
    return false;
  }

  /**
   * Clear all sessions
   */
  clearAllSessions() {
    this.sessions = [];
    this.saveSessions();
    console.log('🗑️  All sessions cleared');
  }

  /**
   * Export sessions as JSON
   * @returns {string} JSON string of sessions
   */
  exportSessions() {
    return JSON.stringify(this.sessions, null, 2);
  }

  /**
   * Import sessions from JSON
   * @param {string} jsonData - JSON string
   * @returns {boolean} Success flag
   */
  importSessions(jsonData) {
    try {
      const imported = JSON.parse(jsonData);
      if (Array.isArray(imported)) {
        this.sessions = [...this.sessions, ...imported];
        this.saveSessions();
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Failed to import sessions:', error);
      return false;
    }
  }

  /**
   * Save sessions to localStorage
   * @private
   */
  saveSessions() {
    try {
      localStorage.setItem('studyflow_sessions', JSON.stringify(this.sessions));
    } catch (error) {
      console.error('❌ Failed to save sessions:', error);
    }
  }

  /**
   * Load sessions from localStorage
   * @private
   */
  loadSessions() {
    try {
      const stored = localStorage.getItem('studyflow_sessions');
      if (stored) {
        this.sessions = JSON.parse(stored);
      }
    } catch (error) {
      console.error('❌ Failed to load sessions:', error);
      this.sessions = [];
    }
  }

  /**
   * Generate unique session ID
   * @private
   * @returns {string} Session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export for use in browsers and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DurationTracker;
}
