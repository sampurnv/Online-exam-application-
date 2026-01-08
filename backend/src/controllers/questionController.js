const Question = require('../models/Question');

/**
 * @desc    Create new question
 * @route   POST /api/questions
 * @access  Private (Teacher/Admin)
 */
exports.createQuestion = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    
    const question = await Question.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      question,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all questions
 * @route   GET /api/questions
 * @access  Private (Teacher/Admin)
 */
exports.getQuestions = async (req, res, next) => {
  try {
    let query = {};

    // Filter based on query params
    if (req.query.type) {
      query.type = req.query.type;
    }
    if (req.query.subject) {
      query.subject = req.query.subject;
    }
    if (req.query.topic) {
      query.topic = req.query.topic;
    }
    if (req.query.difficulty) {
      query.difficulty = req.query.difficulty;
    }

    // Teachers can only see their own questions
    if (req.user.role === 'teacher') {
      query.createdBy = req.user.id;
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Question.countDocuments(query);
    const questions = await Question.find(query)
      .populate('createdBy', 'name email')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      pagination: {
        page,
        limit,
        total,
      },
      questions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single question
 * @route   GET /api/questions/:id
 * @access  Private (Teacher/Admin)
 */
exports.getQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update question
 * @route   PUT /api/questions/:id
 * @access  Private (Teacher/Admin)
 */
exports.updateQuestion = async (req, res, next) => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Check ownership
    if (question.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this question',
      });
    }

    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      question,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete question
 * @route   DELETE /api/questions/:id
 * @access  Private (Teacher/Admin)
 */
exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Check ownership
    if (question.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this question',
      });
    }

    await question.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
