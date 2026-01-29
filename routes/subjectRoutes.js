const express = require('express');
const { body, validationResult } = require('express-validator');
const Subject = require('../models/Subject');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Add subject
router.post(
  '/',
  authMiddleware,
  [body('name').notEmpty().withMessage('Subject name is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, color } = req.body;

      const subject = new Subject({
        userId: req.userId,
        name,
        color: color || '#3498db',
      });

      await subject.save();
      res.status(201).json({ message: 'Subject created', subject });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Get all subjects
router.get('/', authMiddleware, async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.userId });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get subject by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update subject
router.put(
  '/:id',
  authMiddleware,
  [body('name').notEmpty().withMessage('Subject name is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, color } = req.body;

      const subject = await Subject.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { name, color: color || '#3498db' },
        { new: true }
      );

      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      res.json({ message: 'Subject updated', subject });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Delete subject
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({ message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
