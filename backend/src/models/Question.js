const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'true-false', 'short', 'long'],
    required: [true, 'Please specify question type'],
  },
  question: {
    type: String,
    required: [true, 'Please add a question'],
  },
  options: [{
    type: String,
  }],
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
  },
  marks: {
    type: Number,
    required: [true, 'Please specify marks'],
  },
  negativeMarks: {
    type: Number,
    default: 0,
  },
  subject: {
    type: String,
    required: [true, 'Please specify subject'],
  },
  topic: String,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  explanation: String,
  imageUrl: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // For subjective questions
  modelAnswer: String,
  keywords: [String],
  
  // Metadata
  timesUsed: {
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
QuestionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes
QuestionSchema.index({ createdBy: 1 });
QuestionSchema.index({ type: 1 });
QuestionSchema.index({ subject: 1, topic: 1 });
QuestionSchema.index({ difficulty: 1 });

module.exports = mongoose.model('Question', QuestionSchema);
