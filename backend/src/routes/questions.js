const express = require('express');
const {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('teacher', 'admin'), getQuestions)
  .post(protect, authorize('teacher', 'admin'), createQuestion);

router
  .route('/:id')
  .get(protect, authorize('teacher', 'admin'), getQuestion)
  .put(protect, authorize('teacher', 'admin'), updateQuestion)
  .delete(protect, authorize('teacher', 'admin'), deleteQuestion);

module.exports = router;
