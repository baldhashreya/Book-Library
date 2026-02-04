import React, { useEffect, useState } from "react";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import MainLayout from "../../../shared/layouts/MainLayout";
import { useAuth } from "../../../contexts/AuthContext";
import "./AboutMePage.css";
import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { userService } from "../../users/userService";
import type { UserFormData } from "../../../types/user";
import { authService } from "../../login/authService";
import LockIcon from "@mui/icons-material/Lock";
import CustomButton from "../../../shared/components/Button/CustomButton";
import { Box } from "@mui/material";
import CustomTypography from "../../../shared/components/CustomTypography";

const ProfilePage: React.FC = () => {
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
      <div className="profile-content">
        <div className="profile-card">
          <Box className="detail-section">
            <h3>Account Information</h3>
            <Box className="detail-grid">
              <Box className="detail-item">
                <CustomTypography
                  variant="body1"
                  className="label"
                  label="Name"
                />
                <CustomTypography
                  variant="body2"
                  className="value"
                  label={userData.userName || userData.name}
                />
              </Box>

              <Box className="detail-item">
                <CustomTypography
                  variant="body1"
                  className="label"
                  label="Email"
                />
                <CustomTypography
                  variant="body2"
                  className="value"
                  label={userData.email || "N/A"}
                />
              </Box>

              <Box className="detail-item">
                <CustomTypography
                  variant="body1"
                  className="label"
                  label="Role"
                />
                <CustomTypography
                  variant="body2"
                  className="value"
                  label={userData.role?.name || "N/A"}
                />
              </Box>

              <Box className="detail-item">
                <CustomTypography
                  variant="body1"
                  className="label"
                  label="Status"
                />
                <CustomTypography
                  variant="body2"
                  className={`value status-indicator ${
                    userData.status === "active" ? "active" : "in-active"
                  }`}
                  label={userData.status === "active" ? "Active" : "Inactive"}
                />
              </Box>

              <Box className="detail-item">
                <CustomTypography
                  variant="body1"
                  className="label"
                  label="Phone"
                />
                <CustomTypography
                  variant="body2"
                  className="value"
                  label={userData.contactInfo?.phone || "N/A"}
                />
              </Box>

              <Box className="detail-item">
                <CustomTypography
                  variant="body1"
                  className="label"
                  label="Address"
                />
                <CustomTypography
                  variant="body2"
                  className="value"
                  label={userData.contactInfo?.address || "N/A"}
                />
              </Box>
            </Box>
          </Box>

          <Box className="detail-section">
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
          </Box>
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

export default ProfilePage;
