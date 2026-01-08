import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/apiService';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [availableExams, setAvailableExams] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getStudentDashboard();
      setStats(response.data.stats);
      setAvailableExams(response.data.availableExams);
      setRecentResults(response.data.recentResults);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = (examId) => {
    navigate(`/student/exam/${examId}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div className="header">
        <h1>Student Dashboard</h1>
        <div className="header-actions">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard">
        <div className="dashboard-header">
          <h2>My Performance</h2>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Available Exams</h3>
            <div className="value">{stats?.availableExamsCount || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Completed Exams</h3>
            <div className="value">{stats?.completedExams || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Average Score</h3>
            <div className="value">{stats?.averagePercentage || 0}%</div>
          </div>
        </div>

        <div className="card">
          <h3>Available Exams</h3>
          {availableExams.length === 0 ? (
            <p>No exams available at the moment.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Duration</th>
                  <th>Total Marks</th>
                  <th>Start Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {availableExams.map((exam) => (
                  <tr key={exam._id}>
                    <td>{exam.title}</td>
                    <td>{exam.subject}</td>
                    <td>{exam.duration} min</td>
                    <td>{exam.totalMarks}</td>
                    <td>{new Date(exam.startTime).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => handleStartExam(exam._id)}
                      >
                        Start Exam
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h3>Recent Results</h3>
          {recentResults.length === 0 ? (
            <p>No results yet.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Exam</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentResults.map((result) => (
                  <tr key={result._id}>
                    <td>{result.examId?.title || 'N/A'}</td>
                    <td>
                      {result.marksObtained}/{result.totalMarks}
                    </td>
                    <td>{result.percentage.toFixed(2)}%</td>
                    <td>{result.grade}</td>
                    <td>
                      <span
                        style={{
                          color: result.status === 'pass' ? 'green' : 'red',
                        }}
                      >
                        {result.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          navigate(`/results/${result.submissionId}`)
                        }
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
