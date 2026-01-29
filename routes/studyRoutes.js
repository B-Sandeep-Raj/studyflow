const express = require('express');
const { body, validationResult } = require('express-validator');
const StudyLog = require('../models/StudyLog');
const Subject = require('../models/Subject');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Add study log
router.post(
  '/',
  authMiddleware,
  [
    body('subjectId').notEmpty().withMessage('Subject ID is required'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
    body('topic').notEmpty().withMessage('Topic is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { subjectId, duration, topic, status, date } = req.body;

      // Verify subject belongs to user
      const subject = await Subject.findOne({
        _id: subjectId,
        userId: req.userId,
      });

      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      const studyLog = new StudyLog({
        userId: req.userId,
        subjectId,
        duration,
        topic,
        status: status || 'Completed',
        date: date || new Date(),
      });

      await studyLog.save();
      res.status(201).json({ message: 'Study log created', studyLog });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Get all study logs
router.get('/', authMiddleware, async (req, res) => {
  try {
    const studyLogs = await StudyLog.find({ userId: req.userId })
      .populate('subjectId', 'name color')
      .sort({ date: -1 });

    res.json(studyLogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get study logs for today
router.get('/today/logs', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const studyLogs = await StudyLog.find({
      userId: req.userId,
      date: { $gte: today, $lt: tomorrow },
    }).populate('subjectId', 'name color');

    res.json(studyLogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get study logs for the week
router.get('/week/logs', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const studyLogs = await StudyLog.find({
      userId: req.userId,
      date: { $gte: weekAgo, $lte: today },
    }).populate('subjectId', 'name color');

    res.json(studyLogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get analytics
router.get('/analytics/dashboard', authMiddleware, async (req, res) => {
  try {
    const studyLogs = await StudyLog.find({ userId: req.userId }).populate(
      'subjectId',
      'name color'
    );

    // Total hours
    const totalHours = studyLogs.reduce((sum, log) => sum + log.duration, 0) / 60;

    // Today's summary
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayLogs = studyLogs.filter(
      (log) => log.date >= today && log.date < tomorrow
    );
    const todayHours = todayLogs.reduce((sum, log) => sum + log.duration, 0) / 60;

    // Subject-wise time
    const subjectWiseTime = {};
    studyLogs.forEach((log) => {
      if (!subjectWiseTime[log.subjectId._id]) {
        subjectWiseTime[log.subjectId._id] = {
          name: log.subjectId.name,
          color: log.subjectId.color,
          hours: 0,
        };
      }
      subjectWiseTime[log.subjectId._id].hours += log.duration / 60;
    });

    // Weekly chart data
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyData = {};

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      weeklyData[dateStr] = 0;
    }

    studyLogs.forEach((log) => {
      if (log.date >= weekAgo && log.date <= today) {
        const dateStr = log.date.toISOString().split('T')[0];
        if (weeklyData[dateStr] !== undefined) {
          weeklyData[dateStr] += log.duration / 60;
        }
      }
    });

    // Calculate streak
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayLogs = studyLogs.filter(
        (log) => log.date >= date && log.date < nextDate
      );

      if (dayLogs.length > 0) {
        streak++;
      } else {
        break;
      }
    }

    res.json({
      totalHours: parseFloat(totalHours.toFixed(2)),
      todayHours: parseFloat(todayHours.toFixed(2)),
      streak,
      subjectWiseTime: Object.values(subjectWiseTime),
      weeklyData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update study log
router.put(
  '/:id',
  authMiddleware,
  [body('duration').isNumeric().withMessage('Duration must be a number')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { duration, topic, status } = req.body;

      const studyLog = await StudyLog.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { duration, topic, status },
        { new: true }
      );

      if (!studyLog) {
        return res.status(404).json({ message: 'Study log not found' });
      }

      res.json({ message: 'Study log updated', studyLog });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Delete study log
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const studyLog = await StudyLog.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!studyLog) {
      return res.status(404).json({ message: 'Study log not found' });
    }

    res.json({ message: 'Study log deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
