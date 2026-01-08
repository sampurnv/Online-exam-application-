const Result = require('../models/Result');
const Submission = require('../models/Submission');

/**
 * @desc    Get result by submission ID
 * @route   GET /api/results/:submissionId
 * @access  Private
 */
exports.getResult = async (req, res, next) => {
  try {
    const result = await Result.findOne({ submissionId: req.params.submissionId })
      .populate('examId', 'title subject totalMarks')
      .populate('studentId', 'name email rollNumber');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found',
      });
    }

    // Check authorization
    if (
      req.user.role === 'student' &&
      result.studentId._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this result',
      });
    }

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all results for an exam
 * @route   GET /api/results/exam/:examId
 * @access  Private (Teacher/Admin)
 */
exports.getExamResults = async (req, res, next) => {
  try {
    const results = await Result.find({ examId: req.params.examId })
      .populate('studentId', 'name email rollNumber')
      .sort({ percentage: -1 });

    // Calculate ranks
    results.forEach((result, index) => {
      result.rank = index + 1;
    });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get student results
 * @route   GET /api/results/student/:studentId
 * @access  Private
 */
exports.getStudentResults = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;

    // Check authorization
    if (req.user.role === 'student' && req.user.id !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const results = await Result.find({ studentId })
      .populate('examId', 'title subject totalMarks')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get exam statistics
 * @route   GET /api/results/exam/:examId/statistics
 * @access  Private (Teacher/Admin)
 */
exports.getExamStatistics = async (req, res, next) => {
  try {
    const results = await Result.find({ examId: req.params.examId });

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No results found for this exam',
      });
    }

    const totalAttempts = results.length;
    const averageScore = results.reduce((sum, r) => sum + r.percentage, 0) / totalAttempts;
    const highestScore = Math.max(...results.map(r => r.marksObtained));
    const lowestScore = Math.min(...results.map(r => r.marksObtained));
    const passCount = results.filter(r => r.status === 'pass').length;
    const passPercentage = (passCount / totalAttempts) * 100;
    const averageTime = results.reduce((sum, r) => sum + r.timeTaken, 0) / totalAttempts;

    // Grade distribution
    const gradeDistribution = {};
    results.forEach(r => {
      gradeDistribution[r.grade] = (gradeDistribution[r.grade] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      statistics: {
        totalAttempts,
        averageScore: averageScore.toFixed(2),
        highestScore,
        lowestScore,
        passPercentage: passPercentage.toFixed(2),
        averageTime: averageTime.toFixed(2),
        gradeDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};
