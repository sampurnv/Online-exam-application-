const express = require('express');
const {
  submitExam,
  autoSaveAnswers,
  getSubmission,
  getExamSubmissions,
  getStudentSubmissions,
  manualEvaluate,
} = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('student'), submitExam);
router.post('/auto-save', protect, authorize('student'), autoSaveAnswers);
router.get('/:id', protect, getSubmission);
router.get('/exam/:examId', protect, authorize('teacher', 'admin'), getExamSubmissions);
router.get('/student/:studentId', protect, getStudentSubmissions);
router.put('/:id/evaluate', protect, authorize('teacher', 'admin'), manualEvaluate);

module.exports = router;
