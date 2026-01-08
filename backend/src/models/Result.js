const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission',
    required: true,
    unique: true,
  },
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
  totalMarks: {
    type: Number,
    required: true,
  },
  marksObtained: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
  },
  status: {
    type: String,
    enum: ['pass', 'fail'],
    required: true,
  },
  rank: Number,
  
  // Question-wise statistics
  correctAnswers: {
    type: Number,
    default: 0,
  },
  wrongAnswers: {
    type: Number,
    default: 0,
  },
  unattempted: {
    type: Number,
    default: 0,
  },
  
  // Time statistics
  timeTaken: {
    type: Number,
  },
  averageTimePerQuestion: Number,
  
  // Evaluation breakdown
  evaluation: {
    autoGraded: Number,
    manuallyGraded: Number,
    aiGraded: Number,
    pending: Number,
  },
  
  // Subject-wise performance
  subjectPerformance: [{
    subject: String,
    marksObtained: Number,
    totalMarks: Number,
    percentage: Number,
  }],
  
  // Feedback
  teacherFeedback: String,
  strengths: [String],
  weaknesses: [String],
  recommendations: [String],
  
  evaluatedAt: Date,
  publishedAt: Date,
  
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
ResultSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate grade based on percentage
ResultSchema.methods.calculateGrade = function() {
  const percentage = this.percentage;
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C+';
  if (percentage >= 40) return 'C';
  if (percentage >= 33) return 'D';
  return 'F';
};

// Create indexes
ResultSchema.index({ submissionId: 1 }, { unique: true });
ResultSchema.index({ examId: 1 });
ResultSchema.index({ studentId: 1 });
ResultSchema.index({ percentage: -1 });
ResultSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Result', ResultSchema);
