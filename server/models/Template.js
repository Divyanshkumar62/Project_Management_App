const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['Software', 'Marketing', 'Design', 'Research', 'Operations', 'Other']
  },
  tasks: [{
    title: {
      type: String,
      required: true,
      maxlength: 100
    },
    description: {
      type: String,
      maxlength: 500
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    estimatedDays: {
      type: Number,
      min: 1,
      max: 365
    },
    dependencies: [String] // task titles that must be completed first
  }],
  defaultDuration: {
    type: Number,
    required: true,
    min: 1,
    max: 365
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  usageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

templateSchema.index({ category: 1, isPublic: 1 });
templateSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Template', templateSchema);
