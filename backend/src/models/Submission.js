const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attemptNumber: {
    type: Number,
    default: 1,
  },
  startedAt: {
    type: Date,
    required: true,
  },
  submittedAt: {
    type: Date,
  },
  timeTaken: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['in-progress', 'submitted', 'evaluating', 'evaluated', 'timeout'],
    default: 'in-progress',
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    answer: mongoose.Schema.Types.Mixed,
    marksAwarded: {
      type: Number,
      default: 0,
    },
    isCorrect: {
      type: Boolean,
    },
    evaluatedBy: {
      type: String,
      enum: ['auto', 'manual', 'ai'],
      default: 'auto',
    },
    evaluatedAt: Date,
    feedback: String,
  }],
  
  // Auto-save data
  lastSavedAt: Date,
  
  // Proctoring data
  proctoring: {
    tabSwitches: {
      type: Number,
      default: 0,
    },
    suspiciousActivity: [{
      type: String,
      timestamp: Date,
    }],
    screenshots: [String],
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
SubmissionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes
SubmissionSchema.index({ examId: 1, studentId: 1 });
SubmissionSchema.index({ studentId: 1 });
SubmissionSchema.index({ status: 1 });
SubmissionSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('Submission', SubmissionSchema);
