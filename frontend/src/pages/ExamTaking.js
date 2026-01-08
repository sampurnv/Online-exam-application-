import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI, submissionAPI } from '../services/apiService';

const ExamTaking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExam();
  }, [id]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && exam) {
      handleSubmit();
    }
  }, [timeRemaining]);

  const fetchExam = async () => {
    try {
      const response = await examAPI.startExam(id);
      setExam(response.data.exam);
      setTimeRemaining(response.data.exam.duration * 60);
    } catch (error) {
      console.error('Error fetching exam:', error);
      alert('Failed to load exam');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit?')) {
      try {
        const submissionData = {
          examId: id,
          answers: Object.keys(answers).map((questionId) => ({
            questionId,
            answer: answers[questionId],
          })),
          timeTaken: exam.duration - Math.floor(timeRemaining / 60),
        };

        await submissionAPI.submitExam(submissionData);
        alert('Exam submitted successfully!');
        navigate('/student/dashboard');
      } catch (error) {
        console.error('Error submitting exam:', error);
        alert('Failed to submit exam');
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="loading">Loading exam...</div>;
  }

  if (!exam) {
    return <div>Exam not found</div>;
  }

  const question = exam.questions[currentQuestion];

  return (
    <div className="exam-container">
      <div className="timer">Time Left: {formatTime(timeRemaining)}</div>

      <div className="card">
        <h2>{exam.title}</h2>
        <p>{exam.description}</p>
        <p>
          <strong>Instructions:</strong> {exam.instructions}
        </p>
      </div>

      <div className="question-card">
        <div style={{ marginBottom: '16px' }}>
          <strong>
            Question {currentQuestion + 1} of {exam.questions.length}
          </strong>
        </div>

        <div className="question-text">{question.question}</div>

        {question.type === 'mcq' && (
          <div className="options">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`option ${
                  answers[question._id] === option ? 'selected' : ''
                }`}
                onClick={() => handleAnswerChange(question._id, option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}

        {question.type === 'true-false' && (
          <div className="options">
            {['True', 'False'].map((option) => (
              <div
                key={option}
                className={`option ${
                  answers[question._id] === option ? 'selected' : ''
                }`}
                onClick={() => handleAnswerChange(question._id, option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}

        {(question.type === 'short' || question.type === 'long') && (
          <textarea
            className="form-control"
            value={answers[question._id] || ''}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            placeholder="Type your answer here..."
            rows={question.type === 'long' ? 8 : 4}
          />
        )}

        <div className="navigation-buttons">
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>

          <div>
            {currentQuestion === exam.questions.length - 1 ? (
              <button className="btn btn-success" onClick={handleSubmit}>
                Submit Exam
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamTaking;
