import React, { useEffect, useState } from "react";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import LockIcon from "@mui/icons-material/Lock";
import MainLayout from "../../../shared/layouts/MainLayout";
import { useAuth } from "../../../contexts/AuthContext";
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
      await userService.updateUser(userData._id, updatedData);
      toast.success("Profile updated successfully!");
      const response = await userService.getUserById(userData._id);
      localStorage.setItem("user", JSON.stringify(response.data));
      setUserData(response);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "");
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
