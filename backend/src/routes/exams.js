const express = require('express');
const {
  createExam,
  getExams,
  getExam,
  updateExam,
  deleteExam,
  publishExam,
  startExam,
} = require('../controllers/examController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getExams)
  .post(protect, authorize('teacher', 'admin'), createExam);

router
  .route('/:id')
  .get(protect, getExam)
  .put(protect, authorize('teacher', 'admin'), updateExam)
  .delete(protect, authorize('teacher', 'admin'), deleteExam);

router.put('/:id/publish', protect, authorize('teacher', 'admin'), publishExam);
router.get('/:id/start', protect, authorize('student'), startExam);

module.exports = router;
