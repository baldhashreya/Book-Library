import React, { useEffect, useState, useCallback } from "react";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import LockIcon from "@mui/icons-material/Lock";
import MainLayout from "../../../shared/layouts/MainLayout";
import "./ProfilePage.css";
import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { userService } from "../../users/userService";
import type { UserFormData } from "../../../types/user";
import { authService } from "../../login/authService";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CustomButton from "../../../shared/components/Button/CustomButton";
import "../../../shared/styles/model.css";
import { toast } from "react-toastify";

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
      await userService.updateUser(userData._id, updatedData);
      toast.success("Profile updated successfully!");
      const response = await userService.getUserById(userData._id);
      localStorage.setItem("user", JSON.stringify(response.data));
      setUserData(response);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "");
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
      <div className="profile-page">
        <div className="outer-card">
          <h2 className="title">My Profile</h2>
          <div className="inner-card">
            {/* Header */}
            <div className="profile-header">
              <div className="avatar">
                {userData.profile_icon ?
                  <img src={userData.profile_icon} />
                : <AccountCircleIcon
                    sx={{
                      height: "100%",
                      width: "100%",
                      color: "#dbeafe",
                      p: 0,
                      m: 0,
                    }}
                  />
                }
              </div>
              <div>
                <div className="user-details">
                  <div className="user-info">
                    <h3>{userData.userName || userData.name}</h3>
                    <span className="role">{userData.role?.name}</span>
                  </div>

                  <div
                    className={`status-badge ${
                      userData.status === "active" ? "active" : "inactive"
                    }`}
                  >
                    {userData.status === "active" ? "Active" : "Inactive"}
                  </div>
                </div>
                <div className="personal_details">
                  <div>
                    <label>Email</label>
                    <p>{userData.email}</p>
                  </div>

                  <div>
                    <label>Phone</label>
                    <p>{userData.contactInfo?.phone || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="info-grid">
              <div>
                <label>Address</label>
                <p>{userData.contactInfo?.address || "N/A"}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="profile-actions">
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
