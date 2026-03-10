import React, { useEffect, useState, useCallback } from "react";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import MainLayout from "../../../shared/layouts/MainLayout";
import "./ProfilePage.css";
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
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  useEffect(() => {
    const storedUserStr = localStorage.getItem("user");
    if (storedUserStr) {
      try {
        setUser(JSON.parse(storedUserStr));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
    setLoading(false);
  }, []);

  const handleUpdateProfile = useCallback(async (updatedData: UserFormData) => {
    if (!user) return;
    try {
      console.log(updatedData);
      await userService.updateUser(user._id, updatedData);
      const response = await userService.getUserById(user._id);
      localStorage.setItem("user", JSON.stringify(response));
      setUser(response);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }, [user]);

  const handleUpdatePassword = useCallback(async (password: string) => {
    if (!user) return;
    try {
      await authService.resetPassword(user.email, password);
      setUser({ ...user }); 
    } catch (error) {
      console.error("Error updating password:", error);
    }
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

  if (!user) {
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
                  label={user.userName || user.name}
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
                  label={user.email || "N/A"}
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
                  label={user.role?.name || "N/A"}
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
                    user.status === "active" ? "active" : "in-active"
                  }`}
                  label={user.status === "active" ? "Active" : "Inactive"}
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
                  label={user.contactInfo?.phone || "N/A"}
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
                  label={user.contactInfo?.address || "N/A"}
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
          onClose={useCallback(() => setIsEditOpen(false), [])}
          user={user}
          onSave={(updatedData) => handleUpdateProfile(updatedData)}
        />
      )}

      {isPasswordOpen && (
        <ChangePasswordModal
          onClose={useCallback(() => setIsPasswordOpen(false), [])}
          onSave={(data: string) => handleUpdatePassword(data)}
        />
      )}
    </MainLayout>
  );
};

export default ProfilePage;
