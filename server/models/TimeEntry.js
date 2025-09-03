const mongoose = require('mongoose');

const TimeEntrySchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  isRunning: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculate duration before saving
TimeEntrySchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60));
    this.isRunning = false;
  }
  next();
});

module.exports = mongoose.model('TimeEntry', TimeEntrySchema);
