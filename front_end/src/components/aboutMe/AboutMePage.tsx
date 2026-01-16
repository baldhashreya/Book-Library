import React, { useEffect, useState } from "react";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import MainLayout from "../MainLayout";
import { useAuth } from "../../contexts/AuthContext";
import "./AboutMePage.css";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { userService } from "../../services/userService";
import type { UserFormData } from "../../types/user";
import { authService } from "../../services/authService";
import LockIcon from "@mui/icons-material/Lock";
import CustomButton from "../common/Button/CustomButton";

const AboutMePage: React.FC = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

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
        setUserData(currentUser);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  const handleUpdateProfile = async (updatedData: UserFormData) => {
    try {
      console.log(updatedData);
      await userService.updateUser(userData._id, updatedData);
      const response = await userService.getUserById(userData._id);
      localStorage.setItem("user", JSON.stringify(response));
      setUserData(response);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleUpdatePassword = async (password: string) => {
    try {
      const userModel = JSON.parse(localStorage.getItem("user"));
      await authService.resetPassword(userModel.email, password);
      setUserData(userModel);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

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
                    <span className="value">
                      {userData.userName
                        ? userData.userName
                        : userData.name}
                    </span>
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
                  <div className="detail-item">
                    <span className="label">Phone</span>
                    <span className="value">
                      {userData.contactInfo && userData.contactInfo.phone
                        ? userData.contactInfo.phone
                        : ""}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Address</span>
                    <span className="value">
                      {userData.contactInfo && userData.contactInfo.address
                        ? userData.contactInfo.address
                        : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <CustomButton
                    variant="contained"
                    onClick={() => setIsEditOpen(true)}
                    label="Update User"
                    className="action-button"
                    type="submit"
                    disabled={loading}
                    startIcon={<ModeEditOutlineIcon />}
                  />
                  <CustomButton
                    variant="contained"
                    onClick={() => setIsPasswordOpen(true)}
                    label="Change Password"
                    className="action-button"
                    startIcon={<LockIcon />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isEditOpen && (
        <EditProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          user={userData}
          onSave={(updatedData) => handleUpdateProfile(updatedData)}
        />
      )}

      {isPasswordOpen && (
        <ChangePasswordModal
          onClose={() => setIsPasswordOpen(false)}
          onSave={(data) => handleUpdatePassword(data)}
        />
      )}
    </MainLayout>
  );
};

export default AboutMePage;
