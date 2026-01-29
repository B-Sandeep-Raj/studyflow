/* ═══════════════════════════════════════════════════════════════════════════
   STUDY TIMER - CORE LOGIC & PERSISTENCE (FIXED)
   Production-Ready with Accuracy, Persistence, and Visit Tracking
   ═══════════════════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════════════════════
// STUDY TIMER CLASS
// ═══════════════════════════════════════════════════════════════════════════

class StudyTimer {
  constructor() {
    // Timer state
    this.sessionStartTime = null;
    this.pausedTime = 0;
    this.isPaused = false;
    this.isRunning = false;

    // Session data
    this.currentSession = {
      startTime: null,
      endTime: null,
      duration: 0,
      subject: 'General Study',
      notes: '',
      status: 'Pending',
    };

    // UI Elements
    this.elements = {
      startBtn: document.getElementById('startBtn'),
      pauseBtn: document.getElementById('pauseBtn'),
      stopBtn: document.getElementById('stopBtn'),
      hours: document.getElementById('hours'),
      minutes: document.getElementById('minutes'),
      seconds: document.getElementById('seconds'),
      miniHours: document.getElementById('miniHours'),
      miniMinutes: document.getElementById('miniMinutes'),
      miniSeconds: document.getElementById('miniSeconds'),
      subjectInput: document.getElementById('subjectInput'),
      notesInput: document.getElementById('notesInput'),
      sessionsToday: document.getElementById('sessionsToday'),
      totalTimeToday: document.getElementById('totalTimeToday'),
      avgSession: document.getElementById('avgSession'),
      sessionsList: document.getElementById('sessionsList'),
      miniTimer: document.getElementById('miniTimer'),
      digitalTimer: document.getElementById('digitalTimer'),
      hourHand: document.getElementById('hourHand'),
      minuteHand: document.getElementById('minuteHand'),
      secondHand: document.getElementById('secondHand'),
      summaryModal: document.getElementById('summaryModal'),
      statusText: document.getElementById('statusText'),
      statusDot: document.getElementById('statusIndicator'),
      toast: document.getElementById('toast'),
      ringProgress: document.getElementById('ringProgress'),
      clearHistoryBtn: document.getElementById('clearHistoryBtn'),
      themToggle: document.getElementById('themToggle'),
    };

    // Data storage
    this.sessions = [];
    this.inactivityTimeout = null;
    this.lastActiveTime = Date.now();

    // Initialize
    this.init();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  init() {
    console.log('🚀 StudyTimer initializing...');
    this.loadState();
    this.attachEventListeners();
    this.updateDisplay();
    this.loadTodaysSessions();
    this.initTheme();
    this.startFrameUpdate();
    this.setupVisibilityTracking();
    this.setupInactivityDetection();
    // Start analog clock updater (runs regardless of timer state)
    this.updateAnalogClock();
    this._analogInterval = setInterval(() => this.updateAnalogClock(), 1000);
    console.log('✅ StudyTimer initialized');
  }

  attachEventListeners() {
    this.elements.startBtn.addEventListener('click', () => this.start());
    this.elements.pauseBtn.addEventListener('click', () => this.pause());
    this.elements.stopBtn.addEventListener('click', () => this.stop());
    this.elements.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    this.elements.themToggle.addEventListener('click', () => this.toggleTheme());

    // Modal controls
    document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
    document.getElementById('closeSummaryBtn').addEventListener('click', () => this.closeModal());
    document.getElementById('saveSummaryBtn').addEventListener('click', () =>
      this.saveSummaryAndClose()
    );
  }

  initTheme() {
    const saved = localStorage.getItem('timerTheme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark-mode');
      this.updateThemeIcon('light');
    } else if (saved === 'light') {
      document.documentElement.classList.remove('dark-mode');
      this.updateThemeIcon('dark');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        document.documentElement.classList.add('dark-mode');
        this.updateThemeIcon('light');
      }
    }
  }

  updateThemeIcon(nextTheme) {
    const icon = this.elements.themToggle.querySelector('i');
    if (icon) {
      icon.className = nextTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
  }

  toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('timerTheme', isDark ? 'dark' : 'light');
    this.updateThemeIcon(isDark ? 'light' : 'dark');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TIMER CONTROL
  // ═══════════════════════════════════════════════════════════════════════════

  start() {
    if (this.isRunning) return;

    this.sessionStartTime = Date.now() - this.pausedTime;
    this.isPaused = false;
    this.isRunning = true;
    this.lastActiveTime = Date.now();

    this.currentSession.startTime = new Date().toISOString();
    this.currentSession.subject = this.elements.subjectInput.value || 'General Study';

    this.updateUIState();
    this.saveState();

    this.showToast('Study session started!', 'success');
    console.log('▶️ Timer started');
  }

  pause() {
    if (!this.isRunning || this.isPaused) return;

    this.isPaused = true;
    this.isRunning = false;
    this.pausedTime = Date.now() - this.sessionStartTime;

    this.updateUIState();
    this.saveState();

    this.showToast('Session paused', 'warning');
    console.log('⏸️ Timer paused');
  }

  resume() {
    if (this.isPaused) {
      this.sessionStartTime = Date.now() - this.pausedTime;
      this.isPaused = false;
      this.isRunning = true;
      this.lastActiveTime = Date.now();

      this.updateUIState();
      this.saveState();

      this.showToast('Session resumed!', 'success');
    }
  }

  stop() {
    if (!this.isRunning && !this.isPaused) return;

    this.isRunning = false;
    this.isPaused = false;

    // Calculate duration
    const elapsedMs = (this.sessionStartTime ? Date.now() - this.sessionStartTime : 0) +
      this.pausedTime;
    const elapsedMinutes = Math.round(elapsedMs / 60000);

    if (elapsedMinutes < 1) {
      this.showToast('Session too short (minimum 1 minute)', 'warning');
      this.resetTimer();
      return;
    }

    this.currentSession.endTime = new Date().toISOString();
    this.currentSession.duration = elapsedMinutes;
    this.currentSession.notes = this.elements.notesInput.value;
    this.currentSession.status = 'Completed';

    this.showSummary();
    this.updateUIState();
    console.log('⏹️ Timer stopped');
  }

  resetTimer() {
    this.sessionStartTime = null;
    this.pausedTime = 0;
    this.isPaused = false;
    this.isRunning = false;

    this.currentSession = {
      startTime: null,
      endTime: null,
      duration: 0,
      subject: 'General Study',
      notes: '',
      status: 'Pending',
    };

    this.updateDisplay();
    this.updateUIState();
    this.saveState();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DISPLAY UPDATE (FIXED FOR DESKTOP)
  // ═══════════════════════════════════════════════════════════════════════════

  updateDisplay() {
    if (!this.isRunning && !this.isPaused) {
      this.setTime(0, 0, 0);
      return;
    }

    const elapsed = this.sessionStartTime ? Date.now() - this.sessionStartTime : 0;
    const totalMs = elapsed + this.pausedTime;
    const totalSeconds = Math.floor(totalMs / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.setTime(hours, minutes, seconds);

    // Update progress ring (max 30 minutes)
    const maxSeconds = 30 * 60;
    const progress = Math.min(totalSeconds / maxSeconds, 1);
    const circumference = 597; // 2 * π * 95
    const offset = circumference * (1 - progress);
    this.elements.ringProgress.style.strokeDashoffset = offset;

    // DESKTOP FIX: Always ensure digital timer is visible when running
    if (this.isRunning || this.isPaused) {
      if (this.elements.digitalTimer) {
        this.elements.digitalTimer.style.display = 'flex';
        this.elements.digitalTimer.style.visibility = 'visible';
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ANALOG CLOCK (shows real current time)
  // ═══════════════════════════════════════════════════════════════════════════

  updateAnalogClock() {
    try {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours() % 12 + minutes / 60;

      const secDeg = seconds * 6; // 360/60
      const minDeg = minutes * 6 + seconds * 0.1;
      const hrDeg = hours * 30; // 360/12

      const { hourHand, minuteHand, secondHand } = this.elements;

      if (hourHand) {
        hourHand.style.transformOrigin = '100px 100px';
        hourHand.style.transform = `rotate(${hrDeg}deg)`;
      }
      if (minuteHand) {
        minuteHand.style.transformOrigin = '100px 100px';
        minuteHand.style.transform = `rotate(${minDeg}deg)`;
      }
      if (secondHand) {
        secondHand.style.transformOrigin = '100px 100px';
        secondHand.style.transform = `rotate(${secDeg}deg)`;
      }
    } catch (e) {
      // ignore if elements not present
    }
  }

  setTime(h, m, s) {
    this.elements.hours.textContent = String(h).padStart(2, '0');
    this.elements.minutes.textContent = String(m).padStart(2, '0');
    this.elements.seconds.textContent = String(s).padStart(2, '0');

    // Update mini timer
    this.elements.miniHours.textContent = String(h).padStart(2, '0');
    this.elements.miniMinutes.textContent = String(m).padStart(2, '0');
    this.elements.miniSeconds.textContent = String(s).padStart(2, '0');
  }

  startFrameUpdate() {
    const update = () => {
      if (this.isRunning || this.isPaused) {
        this.updateDisplay();
      }
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UI STATE
  // ═══════════════════════════════════════════════════════════════════════════

  updateUIState() {
    const isActive = this.isRunning;

    // Button visibility
    this.elements.startBtn.classList.toggle('hidden', isActive);
    this.elements.pauseBtn.classList.toggle('hidden', !isActive);

    // DESKTOP FIX: Ensure timer card is visible
    const timerCard = document.querySelector('.timer-card');
    if (timerCard) {
      timerCard.style.display = 'block';
      timerCard.style.visibility = 'visible';
    }

    // Status indicator
    if (isActive) {
      this.elements.statusDot.className = 'status-dot studying';
      this.elements.statusText.textContent = 'Studying...';
    } else if (this.isPaused) {
      this.elements.statusDot.className = 'status-dot paused';
      this.elements.statusText.textContent = 'Session Paused';
    } else {
      this.elements.statusDot.className = 'status-dot idle';
      this.elements.statusText.textContent = 'Ready to Study';
    }

    // Mini timer visibility (show only when hidden AND running)
    if (isActive && document.hidden) {
      this.elements.miniTimer.classList.remove('hidden');
    } else {
      this.elements.miniTimer.classList.add('hidden');
    }

    // Input disable
    const disable = isActive || this.isPaused;
    this.elements.subjectInput.disabled = disable;
    this.elements.notesInput.disabled = disable;

    console.log(`📊 UI State: running=${isActive}, paused=${this.isPaused}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PERSISTENCE (localStorage)
  // ═══════════════════════════════════════════════════════════════════════════

  saveState() {
    const state = {
      sessionStartTime: this.sessionStartTime,
      pausedTime: this.pausedTime,
      isPaused: this.isPaused,
      isRunning: this.isRunning,
      currentSession: this.currentSession,
    };
    localStorage.setItem('timerState', JSON.stringify(state));
    console.log('💾 Timer state saved');
  }

  loadState() {
    const saved = localStorage.getItem('timerState');
    if (!saved) {
      console.log('ℹ️ No saved timer state found');
      return;
    }

    try {
      const state = JSON.parse(saved);

      // Only restore if session is still valid (less than 24 hours old)
      if (state.sessionStartTime) {
        const elapsed = Date.now() - state.sessionStartTime;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (elapsed < maxAge && state.isRunning) {
          this.sessionStartTime = state.sessionStartTime;
          this.pausedTime = state.pausedTime;
          this.isPaused = state.isPaused;
          this.isRunning = true; // FIXED: Restore running state
          this.currentSession = state.currentSession;
          
          console.log('✅ Timer state restored from localStorage');
          console.log(`   Elapsed: ${Math.round(elapsed / 1000)}s, Running: ${this.isRunning}`);
          
          // CRITICAL FIX: Update UI immediately after restore
          this.updateUIState();
          this.updateDisplay();
        } else {
          console.log('⏳ Saved session expired or not running');
        }
      }
    } catch (e) {
      console.error('❌ Failed to load timer state:', e);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  async saveSessionToServer() {
    if (!this.currentSession.startTime) return false;

    try {
      const response = await fetch('/api/timer/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.currentSession),
      });

      if (!response.ok) {
        console.error('Failed to save session to server');
        return false;
      }

      return true;
    } catch (e) {
      console.error('Error saving session:', e);
      return false;
    }
  }

  async logVisit() {
    try {
      await fetch('/api/timer/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          visible: !document.hidden,
        }),
      });
    } catch (e) {
      console.error('Error logging visit:', e);
    }
  }

  async loadTodaysSessions() {
    try {
      const response = await fetch('/api/timer/sessions');
      if (!response.ok) return;

      const data = await response.json();
      const today = new Date().toDateString();

      // Filter today's sessions
      this.sessions = data.filter((session) => {
        const sessionDate = new Date(session.startTime).toDateString();
        return sessionDate === today;
      });

      this.updateStats();
      this.renderSessions();
    } catch (e) {
      console.error('Error loading sessions:', e);
    }
  }

  updateStats() {
    const totalMinutes = this.sessions.reduce((sum, session) => sum + session.duration, 0);
    const sessionCount = this.sessions.length;
    const avgMinutes = sessionCount > 0 ? Math.round(totalMinutes / sessionCount) : 0;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    this.elements.sessionsToday.textContent = sessionCount;
    this.elements.totalTimeToday.textContent = `${hours}h ${minutes}m`;
    this.elements.avgSession.textContent = `${avgMinutes}m`;
  }

  renderSessions() {
    const list = this.elements.sessionsList;

    if (this.sessions.length === 0) {
      list.innerHTML = '<p class="empty-state">No study sessions yet. Start studying!</p>';
      return;
    }

    list.innerHTML = this.sessions
      .map((session) => {
        const start = new Date(session.startTime);
        const duration = Math.round(session.duration);
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        return `
          <div class="session-item">
            <div class="session-header">
              <span class="session-subject">${session.subject}</span>
              <span class="session-duration">
                ${hours}h ${minutes}m
              </span>
            </div>
            <div class="session-meta">
              <span>📅 ${start.toLocaleDateString()}</span>
              <span>⏰ ${start.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}</span>
              <span>✅ ${session.status}</span>
            </div>
            ${
              session.notes
                ? `<div class="session-notes"><strong>Notes:</strong> ${session.notes}</div>`
                : ''
            }
          </div>
        `;
      })
      .join('');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MODAL & SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════

  showSummary() {
    const session = this.currentSession;
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    const duration = Math.round(session.duration);
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    document.getElementById('summarySubject').textContent = session.subject;
    document.getElementById('summaryDuration').textContent =
      hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    document.getElementById('summaryStart').textContent = start.toLocaleString();
    document.getElementById('summaryEnd').textContent = end.toLocaleString();
    document.getElementById('summaryNotes').textContent = session.notes || '-';

    this.elements.summaryModal.classList.remove('hidden');
  }

  closeModal() {
    this.elements.summaryModal.classList.add('hidden');
  }

  async saveSummaryAndClose() {
    const success = await this.saveSessionToServer();

    if (success) {
      this.showToast('Session saved successfully!', 'success');
      this.resetTimer();
      this.closeModal();
      this.loadTodaysSessions();
    } else {
      this.showToast('Failed to save session. Please try again.', 'error');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // NOTIFICATIONS & UI
  // ═══════════════════════════════════════════════════════════════════════════

  showToast(message, type = 'info') {
    const toast = this.elements.toast;
    toast.textContent = message;
    toast.className = `toast ${type}`;

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }

  async clearHistory() {
    if (!confirm('Are you sure you want to clear all study sessions?')) return;

    try {
      const response = await fetch('/api/timer/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) return;

      this.sessions = [];
      this.updateStats();
      this.renderSessions();
      this.showToast('History cleared', 'success');
    } catch (e) {
      console.error('Error clearing history:', e);
      this.showToast('Failed to clear history', 'error');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // VISIBILITY & INACTIVITY TRACKING (FIXED)
  // ═══════════════════════════════════════════════════════════════════════════

  setupVisibilityTracking() {
    document.addEventListener('visibilitychange', () => {
      this.logVisit();

      if (document.hidden && this.isRunning) {
        // ✅ FIXED: Page hidden - show mini timer
        this.elements.miniTimer.classList.remove('hidden');
        console.log('📱 Mini timer shown (tab hidden)');
      } else if (!document.hidden && this.isRunning) {
        // ✅ FIXED: Page became visible - show main timer
        this.elements.miniTimer.classList.add('hidden');
        this.updateUIState();
        this.updateDisplay(); // Ensure display is updated
        console.log('🖥️ Main timer shown (tab visible)');
      }
    });

    document.addEventListener('focus', () => {
      this.lastActiveTime = Date.now();
      if (this.isRunning) {
        this.elements.miniTimer.classList.add('hidden');
        console.log('✅ Window focused - main timer active');
      }
    });

    document.addEventListener('blur', () => {
      console.log('⚠️ Window lost focus');
    });
  }

  setupInactivityDetection() {
    const checkInactivity = () => {
      if (this.isRunning && !this.isPaused) {
        const inactiveFor = Date.now() - this.lastActiveTime;
        const thirtyMinutesMs = 30 * 60 * 1000;

        if (inactiveFor > thirtyMinutesMs) {
          this.pause();
          this.showToast('Session auto-paused after 30 minutes of inactivity', 'warning');
        }
      }

      setTimeout(checkInactivity, 60000); // Check every minute
    };

    document.addEventListener('mousemove', () => {
      this.lastActiveTime = Date.now();
    });
    document.addEventListener('keypress', () => {
      this.lastActiveTime = Date.now();
    });

    setTimeout(checkInactivity, 60000);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZE ON PAGE LOAD (FIXED)
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM loaded - initializing timer');
  window.studyTimer = new StudyTimer();
});

// Save state before closing
window.addEventListener('beforeunload', () => {
  if (window.studyTimer) {
    window.studyTimer.saveState();
    console.log('💾 State saved before unload');
  }
});

// Periodic state saving
setInterval(() => {
  if (window.studyTimer && window.studyTimer.isRunning) {
    window.studyTimer.saveState();
  }
}, 5000);
