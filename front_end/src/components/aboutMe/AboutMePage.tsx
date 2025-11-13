import React from 'react';
import MainLayout from '../MainLayout';
import { useAuth } from '../../contexts/AuthContext';
import './AboutMePage.css';

const AboutMePage: React.FC = () => {
  const { user } = useAuth();

  // Get user data from localStorage as fallback
  const getUserData = () => {
    if (user) return user;
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    return { 
      id: '1', 
      name: 'John Doe', 
      email: 'user@example.com' 
    };
  };

  const currentUser = getUserData();

  // Mock additional user details
  const userDetails = {
    joinDate: 'January 15, 2024',
    lastActive: 'Today',
    totalBooksBorrowed: 12,
    favoriteCategory: 'Fiction',
    membershipType: 'Premium Member'
  };

  return (
    <MainLayout>
      <div className="about-me-page">
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Your personal information and account details</p>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="profile-info">
                <h2>{currentUser.name}</h2>
                <p className="user-email">{currentUser.email}</p>
                <span className="member-badge">{userDetails.membershipType}</span>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-section">
                <h3>Account Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">User ID</span>
                    <span className="value">{currentUser.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Email Address</span>
                    <span className="value">{currentUser.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Member Since</span>
                    <span className="value">{userDetails.joinDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Last Active</span>
                    <span className="value">{userDetails.lastActive}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Library Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-info">
                      <span className="stat-number">{userDetails.totalBooksBorrowed}</span>
                      <span className="stat-label">Books Borrowed</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-info">
                      <span className="stat-number">1</span>
                      <span className="stat-label">Currently Reading</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📑</div>
                    <div className="stat-info">
                      <span className="stat-text">{userDetails.favoriteCategory}</span>
                      <span className="stat-label">Favorite Category</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="action-btn primary">
                    <span>✏️</span>
                    Edit Profile
                  </button>
                  <button className="action-btn secondary">
                    <span>🔒</span>
                    Change Password
                  </button>
                  <button className="action-btn secondary">
                    <span>📋</span>
                    Borrowing History
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-cards">
            <div className="info-card">
              <h3>Account Status</h3>
              <div className="status-indicator active">
                <div className="status-dot"></div>
                Active Account
              </div>
              <p>Your account is in good standing with full access to all library features.</p>
            </div>

            <div className="info-card">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon">📖</span>
                  <div className="activity-details">
                    <span className="activity-text">Borrowed "The Great Gatsby"</span>
                    <span className="activity-time">2 days ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">❤️</span>
                  <div className="activity-details">
                    <span className="activity-text">Added to favorites</span>
                    <span className="activity-time">1 week ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">⭐</span>
                  <div className="activity-details">
                    <span className="activity-text">Rated 5 books</span>
                    <span className="activity-time">2 weeks ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutMePage;