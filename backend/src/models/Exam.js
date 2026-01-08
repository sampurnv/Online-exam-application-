const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add exam title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add exam description'],
  },
  subject: {
    type: String,
    required: [true, 'Please specify subject'],
  },
  class: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  duration: {
    type: Number,
    required: [true, 'Please specify duration in minutes'],
  },
  totalMarks: {
    type: Number,
    required: [true, 'Please specify total marks'],
  },
  passingMarks: {
    type: Number,
    required: [true, 'Please specify passing marks'],
  },
  startTime: {
    type: Date,
    required: [true, 'Please specify start time'],
  },
  endTime: {
    type: Date,
    required: [true, 'Please specify end time'],
  },
  instructions: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'completed', 'archived'],
    default: 'draft',
  },
  settings: {
    randomizeQuestions: {
      type: Boolean,
      default: false,
    },
    randomizeOptions: {
      type: Boolean,
      default: false,
    },
    showResultsImmediately: {
      type: Boolean,
      default: false,
    },
    allowReview: {
      type: Boolean,
      default: true,
    },
    negativeMarking: {
      type: Boolean,
      default: false,
    },
    negativeMarkingValue: {
      type: Number,
      default: 0,
    },
    questionsPerPage: {
      type: Number,
      default: 1,
    },
    allowBackNavigation: {
      type: Boolean,
      default: true,
    },
    showTimer: {
      type: Boolean,
      default: true,
    },
    autoSubmit: {
      type: Boolean,
      default: true,
    },
    proctoring: {
      type: Boolean,
      default: false,
    },
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }],
  allowedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  
  // Statistics
  totalAttempts: {
    type: Number,
    default: 0,
  },
  averageScore: {
    type: Number,
    default: 0,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt before saving
ExamSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes
ExamSchema.index({ createdBy: 1 });
ExamSchema.index({ status: 1 });
ExamSchema.index({ subject: 1 });
ExamSchema.index({ startTime: 1, endTime: 1 });

module.exports = mongoose.model('Exam', ExamSchema);
