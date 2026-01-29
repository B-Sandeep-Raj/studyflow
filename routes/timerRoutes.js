const express = require('express');
const router = express.Router();

// In-memory storage for timer sessions
let studySessions = [];
let visitLogs = [];

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/timer/sessions
// Retrieve all study sessions
// ═══════════════════════════════════════════════════════════════════════════
router.get('/sessions', (req, res) => {
  try {
    res.json(studySessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/timer/save
// Save a study session
// ═══════════════════════════════════════════════════════════════════════════
router.post('/save', (req, res) => {
  try {
    const { startTime, endTime, duration, subject, notes, status } = req.body;

    // Validate required fields
    if (!startTime || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const session = {
      id: Date.now(),
      startTime,
      endTime: endTime || new Date().toISOString(),
      duration,
      subject: subject || 'General Study',
      notes: notes || '',
      status: status || 'Completed',
      savedAt: new Date().toISOString(),
    };

    // Check for duplicates (same start time within 5 seconds)
    const isDuplicate = studySessions.some(
      (s) => Math.abs(new Date(s.startTime) - new Date(startTime)) < 5000
    );

    if (!isDuplicate) {
      studySessions.push(session);
    }

    res.status(201).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/timer/visit
// Log a page visit/visibility change
// ═══════════════════════════════════════════════════════════════════════════
router.post('/visit', (req, res) => {
  try {
    const { timestamp, visible } = req.body;

    const visit = {
      id: Date.now(),
      timestamp: timestamp || new Date().toISOString(),
      visible: visible !== false,
    };

    visitLogs.push(visit);

    res.status(201).json({ success: true, visit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/timer/stats
// Get statistics about study sessions
// ═══════════════════════════════════════════════════════════════════════════
router.get('/stats', (req, res) => {
  try {
    const totalDuration = studySessions.reduce((sum, s) => sum + s.duration, 0);
    const averageDuration =
      studySessions.length > 0 ? Math.round(totalDuration / studySessions.length) : 0;
    const longestSession =
      studySessions.length > 0
        ? Math.max(...studySessions.map((s) => s.duration))
        : 0;

    const stats = {
      totalSessions: studySessions.length,
      totalDuration,
      averageDuration,
      longestSession,
      lastSession: studySessions[studySessions.length - 1] || null,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// DELETE /api/timer/sessions/:id
// Delete a specific study session
// ═══════════════════════════════════════════════════════════════════════════
router.delete('/sessions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const initialLength = studySessions.length;

    studySessions = studySessions.filter((s) => s.id !== parseInt(id));

    if (studySessions.length === initialLength) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ success: true, message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/timer/clear
// Clear all study sessions
// ═══════════════════════════════════════════════════════════════════════════
router.post('/clear', (req, res) => {
  try {
    const count = studySessions.length;
    studySessions = [];
    visitLogs = [];

    res.json({
      success: true,
      message: `Cleared ${count} sessions and all visit logs`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
