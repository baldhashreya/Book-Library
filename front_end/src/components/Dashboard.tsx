import React from 'react';
import MainLayout from './MainLayout';

const Dashboard: React.FC = () => {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : { name: 'User' };

  return (
    <MainLayout>
      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome back, {user.name}! 👋</h2>
          <p>Login successful! You are now on the dashboard.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <h3 className="stat-number">1,247</h3>
            <p className="stat-label">Total Books</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <h3 className="stat-number">586</h3>
            <p className="stat-label">Active Users</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✍️</div>
            <h3 className="stat-number">89</h3>
            <p className="stat-label">Authors</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📑</div>
            <h3 className="stat-number">24</h3>
            <p className="stat-label">Categories</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;