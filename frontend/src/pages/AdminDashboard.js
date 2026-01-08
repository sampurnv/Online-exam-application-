import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, userAPI } from '../services/apiService';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, usersRes] = await Promise.all([
        dashboardAPI.getAdminDashboard(),
        userAPI.getUsers({ limit: 10 }),
      ]);

      setStats(dashboardRes.data.stats);
      setUsers(usersRes.data.users);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await userAPI.approveUser(userId);
      fetchDashboardData();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await userAPI.blockUser(userId);
      fetchDashboardData();
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div className="header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard">
        <div className="dashboard-header">
          <h2>System Overview</h2>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <div className="value">{stats?.totalUsers || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Total Students</h3>
            <div className="value">{stats?.totalStudents || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Total Teachers</h3>
            <div className="value">{stats?.totalTeachers || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Total Exams</h3>
            <div className="value">{stats?.totalExams || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Active Exams</h3>
            <div className="value">{stats?.activeExams || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Total Submissions</h3>
            <div className="value">{stats?.totalSubmissions || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Pending Approvals</h3>
            <div className="value">{stats?.pendingApprovals || 0}</div>
          </div>
        </div>

        <div className="card">
          <h3>Recent Users</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    {u.isBlocked ? (
                      <span style={{ color: 'red' }}>Blocked</span>
                    ) : !u.isApproved && u.role === 'teacher' ? (
                      <span style={{ color: 'orange' }}>Pending</span>
                    ) : (
                      <span style={{ color: 'green' }}>Active</span>
                    )}
                  </td>
                  <td>
                    {!u.isApproved && u.role === 'teacher' && (
                      <button
                        className="btn btn-success"
                        onClick={() => handleApproveUser(u._id)}
                        style={{ marginRight: '8px' }}
                      >
                        Approve
                      </button>
                    )}
                    <button
                      className="btn btn-danger"
                      onClick={() => handleBlockUser(u._id)}
                    >
                      {u.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
