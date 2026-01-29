const mongoose = require('mongoose');

const studyLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Completed', 'Pending'],
    default: 'Completed',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StudyLog', studyLogSchema);
