import React, { useEffect, useState } from "react";
import { Pencil, Lock } from "lucide-react";
import MainLayout from "../MainLayout";
import { useAuth } from "../../contexts/AuthContext";
import "./AboutMePage.css";

const AboutMePage: React.FC = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let currentUser = user;
        if (!currentUser) {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            currentUser = JSON.parse(userStr);
          }
        }

        // Optionally fetch fresh data from API
        setUserData(currentUser);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </MainLayout>
    );
  }

  if (!userData) {
    return (
      <MainLayout>
        <div className="empty-state">
          <h3>No user data found</h3>
          <p>Please log in again to view your profile.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="about-me-page">
        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-details">
              <div className="detail-section">
                <h3>Account Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Name</span>
                    <span className="value">{userData.firstName + " " + userData.lastName|| "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Email</span>
                    <span className="value">{userData.email || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Role</span>
                    <span className="value">
                      {userData.role?.name || "N/A"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Status</span>
                    <span className="value">
                      {userData.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="action-btn primary"><Pencil /> Edit Profile</button>
                  <button className="action-btn secondary"><Lock /> Change Password</button>
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
