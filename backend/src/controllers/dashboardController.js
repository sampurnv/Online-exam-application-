const User = require('../models/User');
const Exam = require('../models/Exam');
const Submission = require('../models/Submission');
const Result = require('../models/Result');

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/dashboard/admin
 * @access  Private (Admin)
 */
exports.getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalExams = await Exam.countDocuments();
    const activeExams = await Exam.countDocuments({ 
      status: 'published',
      startTime: { $lte: new Date() },
      endTime: { $gte: new Date() }
    });
    const totalSubmissions = await Submission.countDocuments();
    const pendingApprovals = await User.countDocuments({ 
      role: 'teacher',
      isApproved: false 
    });

    // Recent activities
    const recentExams = await Exam.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentSubmissions = await Submission.find({ status: 'evaluated' })
      .populate('studentId', 'name')
      .populate('examId', 'title')
      .sort({ submittedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalExams,
        activeExams,
        totalSubmissions,
        pendingApprovals,
      },
      recentExams,
      recentSubmissions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get teacher dashboard statistics
 * @route   GET /api/dashboard/teacher
 * @access  Private (Teacher)
 */
exports.getTeacherDashboard = async (req, res, next) => {
  try {
    const myExams = await Exam.countDocuments({ createdBy: req.user.id });
    const publishedExams = await Exam.countDocuments({ 
      createdBy: req.user.id,
      status: 'published'
    });
    const draftExams = await Exam.countDocuments({ 
      createdBy: req.user.id,
      status: 'draft'
    });

    // Get total submissions for my exams
    const examIds = await Exam.find({ createdBy: req.user.id }).select('_id');
    const totalSubmissions = await Submission.countDocuments({
      examId: { $in: examIds.map(e => e._id) }
    });

    // Recent exams
    const recentExams = await Exam.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Pending evaluations
    const pendingEvaluations = await Submission.countDocuments({
      examId: { $in: examIds.map(e => e._id) },
      status: 'submitted'
    });

    res.status(200).json({
      success: true,
      stats: {
        myExams,
        publishedExams,
        draftExams,
        totalSubmissions,
        pendingEvaluations,
      },
      recentExams,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get student dashboard statistics
 * @route   GET /api/dashboard/student
 * @access  Private (Student)
 */
exports.getStudentDashboard = async (req, res, next) => {
  try {
    // Available exams
    const availableExams = await Exam.find({
      status: 'published',
      startTime: { $lte: new Date() },
      endTime: { $gte: new Date() }
    }).sort({ startTime: 1 });

    // My submissions
    const mySubmissions = await Submission.countDocuments({ 
      studentId: req.user.id 
    });

    // Completed exams
    const completedExams = await Submission.countDocuments({
      studentId: req.user.id,
      status: 'evaluated'
    });

    // Recent results
    const recentResults = await Result.find({ studentId: req.user.id })
      .populate('examId', 'title subject totalMarks')
      .sort({ createdAt: -1 })
      .limit(5);

    // Overall performance
    const allResults = await Result.find({ studentId: req.user.id });
    const averagePercentage = allResults.length > 0
      ? allResults.reduce((sum, r) => sum + r.percentage, 0) / allResults.length
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        availableExamsCount: availableExams.length,
        mySubmissions,
        completedExams,
        averagePercentage: averagePercentage.toFixed(2),
      },
      availableExams,
      recentResults,
    });
  } catch (error) {
    next(error);
  }
};
