const express = require('express');
const {
  getResult,
  getExamResults,
  getStudentResults,
  getExamStatistics,
} = require('../controllers/resultController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/:submissionId', protect, getResult);
router.get('/exam/:examId', protect, authorize('teacher', 'admin'), getExamResults);
router.get('/student/:studentId', protect, getStudentResults);
router.get('/exam/:examId/statistics', protect, authorize('teacher', 'admin'), getExamStatistics);

module.exports = router;
