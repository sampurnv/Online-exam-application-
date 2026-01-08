const Submission = require('../models/Submission');
const Result = require('../models/Result');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const axios = require('axios');

/**
 * @desc    Submit exam
 * @route   POST /api/submissions
 * @access  Private (Student)
 */
exports.submitExam = async (req, res, next) => {
  try {
    const { examId, answers, timeTaken } = req.body;

    // Check if exam exists
    const exam = await Exam.findById(examId).populate('questions');
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }

    // Create submission
    const submission = await Submission.create({
      examId,
      studentId: req.user.id,
      startedAt: new Date(Date.now() - timeTaken * 60 * 1000),
      submittedAt: new Date(),
      timeTaken,
      answers,
      status: 'evaluating',
    });

    // Auto-evaluate
    await evaluateSubmission(submission, exam);

    res.status(201).json({
      success: true,
      message: 'Exam submitted successfully',
      submissionId: submission._id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Auto-save answers
 * @route   POST /api/submissions/auto-save
 * @access  Private (Student)
 */
exports.autoSaveAnswers = async (req, res, next) => {
  try {
    const { examId, answers } = req.body;

    // Find or create submission
    let submission = await Submission.findOne({
      examId,
      studentId: req.user.id,
      status: 'in-progress',
    });

    if (!submission) {
      submission = await Submission.create({
        examId,
        studentId: req.user.id,
        startedAt: new Date(),
        answers,
        status: 'in-progress',
      });
    } else {
      submission.answers = answers;
      submission.lastSavedAt = new Date();
      await submission.save();
    }

    res.status(200).json({
      success: true,
      message: 'Answers saved',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get submission by ID
 * @route   GET /api/submissions/:id
 * @access  Private
 */
exports.getSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('examId')
      .populate('studentId', 'name email')
      .populate('answers.questionId');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    // Check authorization
    if (
      req.user.role === 'student' &&
      submission.studentId._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this submission',
      });
    }

    res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all submissions for an exam
 * @route   GET /api/submissions/exam/:examId
 * @access  Private (Teacher/Admin)
 */
exports.getExamSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ examId: req.params.examId })
      .populate('studentId', 'name email rollNumber')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get student submissions
 * @route   GET /api/submissions/student/:studentId
 * @access  Private
 */
exports.getStudentSubmissions = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;

    // Check authorization
    if (req.user.role === 'student' && req.user.id !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const submissions = await Submission.find({ studentId })
      .populate('examId', 'title subject totalMarks')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to evaluate submission
 */
async function evaluateSubmission(submission, exam) {
  try {
    let totalMarks = 0;
    let marksObtained = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unattempted = 0;

    // Evaluate each answer
    for (let i = 0; i < submission.answers.length; i++) {
      const answer = submission.answers[i];
      const question = await Question.findById(answer.questionId);

      if (!question) continue;

      totalMarks += question.marks;

      if (!answer.answer || answer.answer === '') {
        unattempted++;
        answer.marksAwarded = 0;
        answer.isCorrect = false;
        continue;
      }

      // Auto-evaluate based on question type
      if (question.type === 'mcq' || question.type === 'true-false') {
        if (answer.answer === question.correctAnswer) {
          answer.marksAwarded = question.marks;
          answer.isCorrect = true;
          correctAnswers++;
          marksObtained += question.marks;
        } else {
          answer.isCorrect = false;
          wrongAnswers++;
          // Apply negative marking if enabled
          if (exam.settings.negativeMarking) {
            const penalty = question.negativeMarks || exam.settings.negativeMarkingValue || 0;
            answer.marksAwarded = -penalty;
            marksObtained -= penalty;
          } else {
            answer.marksAwarded = 0;
          }
        }
        answer.evaluatedBy = 'auto';
        answer.evaluatedAt = new Date();
      } else {
        // For subjective questions, try Python evaluation
        try {
          const pythonResponse = await axios.post(
            `${process.env.PYTHON_SERVICE_URL}/evaluate/subjective`,
            {
              question: question.question,
              answer: answer.answer,
              modelAnswer: question.modelAnswer,
              keywords: question.keywords,
              maxMarks: question.marks,
            },
            { timeout: 5000 }
          );

          if (pythonResponse.data.success) {
            answer.marksAwarded = pythonResponse.data.marksAwarded;
            answer.feedback = pythonResponse.data.feedback;
            answer.evaluatedBy = 'ai';
            answer.evaluatedAt = new Date();
            marksObtained += answer.marksAwarded;
            
            if (answer.marksAwarded >= question.marks * 0.5) {
              correctAnswers++;
            } else {
              wrongAnswers++;
            }
          }
        } catch (pythonError) {
          console.error('Python evaluation error:', pythonError.message);
          // Mark for manual evaluation
          answer.marksAwarded = 0;
          answer.evaluatedBy = 'manual';
        }
      }
    }

    // Update submission
    submission.status = 'evaluated';
    await submission.save();

    // Create result
    const percentage = (marksObtained / totalMarks) * 100;
    const result = await Result.create({
      submissionId: submission._id,
      examId: exam._id,
      studentId: submission.studentId,
      totalMarks,
      marksObtained,
      percentage,
      status: percentage >= ((exam.passingMarks / exam.totalMarks) * 100) ? 'pass' : 'fail',
      correctAnswers,
      wrongAnswers,
      unattempted,
      timeTaken: submission.timeTaken,
      evaluation: {
        autoGraded: submission.answers.filter(a => a.evaluatedBy === 'auto').length,
        aiGraded: submission.answers.filter(a => a.evaluatedBy === 'ai').length,
        pending: submission.answers.filter(a => a.evaluatedBy === 'manual' && !a.evaluatedAt).length,
      },
      evaluatedAt: new Date(),
    });

    result.grade = result.calculateGrade();
    await result.save();

    // Update exam statistics
    exam.totalAttempts += 1;
    const allResults = await Result.find({ examId: exam._id });
    const avgScore = allResults.reduce((sum, r) => sum + r.percentage, 0) / allResults.length;
    exam.averageScore = avgScore;
    await exam.save();

  } catch (error) {
    console.error('Evaluation error:', error);
    throw error;
  }
}

/**
 * @desc    Manual evaluation
 * @route   PUT /api/submissions/:id/evaluate
 * @access  Private (Teacher/Admin)
 */
exports.manualEvaluate = async (req, res, next) => {
  try {
    const { questionId, marksAwarded, feedback } = req.body;

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    // Find the answer to evaluate
    const answerIndex = submission.answers.findIndex(
      a => a.questionId.toString() === questionId
    );

    if (answerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found',
      });
    }

    // Update answer
    submission.answers[answerIndex].marksAwarded = marksAwarded;
    submission.answers[answerIndex].feedback = feedback;
    submission.answers[answerIndex].evaluatedBy = 'manual';
    submission.answers[answerIndex].evaluatedAt = new Date();

    await submission.save();

    // Update result
    const result = await Result.findOne({ submissionId: submission._id });
    if (result) {
      const totalMarksObtained = submission.answers.reduce(
        (sum, a) => sum + (a.marksAwarded || 0),
        0
      );
      result.marksObtained = totalMarksObtained;
      result.percentage = (totalMarksObtained / result.totalMarks) * 100;
      result.grade = result.calculateGrade();
      await result.save();
    }

    res.status(200).json({
      success: true,
      message: 'Answer evaluated successfully',
    });
  } catch (error) {
    next(error);
  }
};
