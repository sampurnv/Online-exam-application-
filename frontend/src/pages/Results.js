import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resultAPI } from '../services/apiService';

const Results = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [submissionId]);

  const fetchResult = async () => {
    try {
      const response = await resultAPI.getResult(submissionId);
      setResult(response.data.result);
    } catch (error) {
      console.error('Error fetching result:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading results...</div>;
  }

  if (!result) {
    return <div>Result not found</div>;
  }

  return (
    <div>
      <div className="header">
        <h1>Exam Result</h1>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <div className="container">
        <div className="card">
          <h2>{result.examId?.title || 'Exam Result'}</h2>
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h3>Score Details</h3>
                <p>
                  <strong>Marks Obtained:</strong> {result.marksObtained} /{' '}
                  {result.totalMarks}
                </p>
                <p>
                  <strong>Percentage:</strong> {result.percentage.toFixed(2)}%
                </p>
                <p>
                  <strong>Grade:</strong> {result.grade}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    style={{
                      color: result.status === 'pass' ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {result.status.toUpperCase()}
                  </span>
                </p>
              </div>

              <div>
                <h3>Performance Analysis</h3>
                <p>
                  <strong>Correct Answers:</strong> {result.correctAnswers}
                </p>
                <p>
                  <strong>Wrong Answers:</strong> {result.wrongAnswers}
                </p>
                <p>
                  <strong>Unattempted:</strong> {result.unattempted}
                </p>
                <p>
                  <strong>Time Taken:</strong> {result.timeTaken} minutes
                </p>
              </div>
            </div>

            {result.teacherFeedback && (
              <div style={{ marginTop: '24px' }}>
                <h3>Teacher's Feedback</h3>
                <p>{result.teacherFeedback}</p>
              </div>
            )}

            {result.strengths && result.strengths.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h3>Strengths</h3>
                <ul>
                  {result.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.weaknesses && result.weaknesses.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h3>Areas for Improvement</h3>
                <ul>
                  {result.weaknesses.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.recommendations && result.recommendations.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h3>Recommendations</h3>
                <ul>
                  {result.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
