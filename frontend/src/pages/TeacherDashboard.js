import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, examAPI } from '../services/apiService';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentExams, setRecentExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getTeacherDashboard();
      setStats(response.data.stats);
      setRecentExams(response.data.recentExams);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div className="header">
        <h1>Teacher Dashboard</h1>
        <div className="header-actions">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard">
        <div className="dashboard-header">
          <h2>My Statistics</h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/teacher/exams/create')}
          >
            Create New Exam
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>My Exams</h3>
            <div className="value">{stats?.myExams || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Published Exams</h3>
            <div className="value">{stats?.publishedExams || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Draft Exams</h3>
            <div className="value">{stats?.draftExams || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Total Submissions</h3>
            <div className="value">{stats?.totalSubmissions || 0}</div>
          </div>
        </div>

        <div className="card">
          <h3>Recent Exams</h3>
          {recentExams.length === 0 ? (
            <p>No exams yet. Create your first exam!</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Total Marks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentExams.map((exam) => (
                  <tr key={exam._id}>
                    <td>{exam.title}</td>
                    <td>{exam.subject}</td>
                    <td>
                      <span
                        style={{
                          color: exam.status === 'published' ? 'green' : 'orange',
                        }}
                      >
                        {exam.status}
                      </span>
                    </td>
                    <td>{exam.duration} min</td>
                    <td>{exam.totalMarks}</td>
                    <td>
                      <button className="btn btn-primary">View</button>
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

export default TeacherDashboard;
