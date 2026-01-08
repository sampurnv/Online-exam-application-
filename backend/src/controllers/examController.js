const Exam = require('../models/Exam');
const Question = require('../models/Question');

/**
 * @desc    Create new exam
 * @route   POST /api/exams
 * @access  Private (Teacher/Admin)
 */
exports.createExam = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    
    const exam = await Exam.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      exam,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all exams
 * @route   GET /api/exams
 * @access  Private
 */
exports.getExams = async (req, res, next) => {
  try {
    let query = {};

    // Filter based on role
    if (req.user.role === 'teacher') {
      query.createdBy = req.user.id;
    } else if (req.user.role === 'student') {
      query.status = 'published';
      // Check if current date is between start and end time
      query.startTime = { $lte: new Date() };
      query.endTime = { $gte: new Date() };
    }

    // Additional filters
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.subject) {
      query.subject = req.query.subject;
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Exam.countDocuments(query);
    const exams = await Exam.find(query)
      .populate('createdBy', 'name email')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      pagination: {
        page,
        limit,
        total,
      },
      exams,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single exam
 * @route   GET /api/exams/:id
 * @access  Private
 */
exports.getExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('questions');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }

    res.status(200).json({
      success: true,
      exam,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update exam
 * @route   PUT /api/exams/:id
 * @access  Private (Teacher/Admin)
 */
exports.updateExam = async (req, res, next) => {
  try {
    let exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }

    // Check ownership
    if (exam.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this exam',
      });
    }

    exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Exam updated successfully',
      exam,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete exam
 * @route   DELETE /api/exams/:id
 * @access  Private (Teacher/Admin)
 */
exports.deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }

    // Check ownership
    if (exam.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this exam',
      });
    }

    await exam.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Exam deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Publish exam
 * @route   PUT /api/exams/:id/publish
 * @access  Private (Teacher/Admin)
 */
exports.publishExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }

    // Check ownership
    if (exam.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to publish this exam',
      });
    }

    exam.status = 'published';
    await exam.save();

    res.status(200).json({
      success: true,
      message: 'Exam published successfully',
      exam,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Start exam (for students)
 * @route   GET /api/exams/:id/start
 * @access  Private (Student)
 */
exports.startExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('questions');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }

    // Check if exam is published
    if (exam.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Exam is not available',
      });
    }

    // Check if exam has started and not ended
    const now = new Date();
    if (now < exam.startTime) {
      return res.status(400).json({
        success: false,
        message: 'Exam has not started yet',
      });
    }
    if (now > exam.endTime) {
      return res.status(400).json({
        success: false,
        message: 'Exam has ended',
      });
    }

    // Randomize questions if required
    let questions = exam.questions;
    if (exam.settings.randomizeQuestions) {
      questions = shuffleArray([...questions]);
    }

    // Remove correct answers from questions
    const questionsForStudent = questions.map(q => ({
      _id: q._id,
      type: q.type,
      question: q.question,
      options: exam.settings.randomizeOptions ? shuffleArray([...q.options]) : q.options,
      marks: q.marks,
      negativeMarks: q.negativeMarks,
    }));

    res.status(200).json({
      success: true,
      exam: {
        id: exam._id,
        title: exam.title,
        description: exam.description,
        instructions: exam.instructions,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        settings: exam.settings,
        questions: questionsForStudent,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to shuffle array
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
