import React, { useState, useEffect } from "react";
import { PencilLine, Trash } from "lucide-react";
import MainLayout from "../MainLayout";
import UserModal from "../users/UserModal";
import type { User, UserFormData, UsersSearchParams } from "../../types/user";
import { userService } from "../../services/userService";
import "./UserPage.css";

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUsers({ limit: 10, offset: 0 } as UsersSearchParams);
  }, []);

  const loadUsers = async (params: UsersSearchParams) => {
    console.log("Loading users with params:", params);
    if (!params) {
      params = { limit: 10, offset: 0 } as UsersSearchParams;
    }
    try {
      setLoading(true);
      const usersData = await userService.getUsers(params);
      let usersArray: User[] = [];

      if (Array.isArray(usersData)) {
        console.log("Response is direct array");
        usersArray = usersData;
      } else if (usersData && usersData.data && Array.isArray(usersData.data)) {
        console.log("Response has nested data array");
        usersArray = usersData.data;
      } else {
        console.warn("Unexpected response format, returning empty array");
        usersArray = [];
      }
      setUsers(usersArray);
      console.log("Users loaded successfully.");
    } catch (error) {
      console.error("UserPage: Error loading users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {}, [users]);

  const handleAddUser = () => {
    setModalMode("add");
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setModalMode("edit");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await userService.deleteUser(userId);
        setUsers((prev) => prev.filter((user) => user._id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user. Please try again.");
      }
    }
  };

  const handleSaveUser = async (userData: UserFormData) => {
    try {
      if (modalMode === "add") {
        const newUser = await userService.createUser(userData);
        setUsers((prev) => [...prev, newUser]);
      } else if (modalMode === "edit" && selectedUser) {
        const updatedUser = await userService.updateUser(
          selectedUser._id,
          userData
        );
        if (updatedUser) {
          setUsers((prev) =>
            prev.map((user) =>
              user._id === selectedUser._id ? updatedUser : user
            )
          );
        }
      }
      await loadUsers({ limit: 10, offset: 0 } as UsersSearchParams);
      setIsModalOpen(false);
      console.log("User saved successfully.");
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  };

  // Safe role display function
  const getRoleDisplay = (user: User) => {
    return (user as any).role.name;
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <span className="status-badge status-active">Active</span>
    ) : (
      <span className="status-badge status-inactive">Inactive</span>
    );
  };

  const filteredUsers = users.filter((user) => {
    console.log("Filtering user:", user);
    if (!user) return false;
    return (
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getRoleDisplay(user).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  return (
    <MainLayout>
      <div className="user-page">
        <div className="page-header">
          <button
            className="add-user-btn"
            onClick={handleAddUser}
          >
            <span>+</span>
            Add New User
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="users-table-container">
            {filteredUsers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <h3>No users found</h3>
                <p>
                  {searchTerm
                    ? "No users match your search criteria. Try adjusting your search."
                    : users.length === 0
                    ? "No users available. Add your first user to get started."
                    : "No users match your search criteria."}
                </p>
                {!searchTerm && users.length === 0 && (
                  <button
                    className="add-user-btn"
                    onClick={handleAddUser}
                  >
                    Add Your First User
                  </button>
                )}
              </div>
            ) : (
              <>
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="user-name">
                            <strong>{user.userName || "N/A"}</strong>
                          </div>
                        </td>
                        <td>{user.email || "N/A"}</td>
                        <td>
                          <span className="role-tag">
                            {user.role ? (user as any).role.name : "N/A"}
                          </span>
                        </td>
                        <td>{getStatusBadge(user.status)}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn edit-btn"
                              onClick={() => handleEditUser(user)}
                              title="Edit User"
                            >
                              <PencilLine />
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => {
                                handleDeleteUser(user._id, user.userName);
                              }}
                              title="Delete User"
                            >
                              <Trash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}
        {/* User edit page */}
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
          user={selectedUser}
          mode={modalMode}
        />
      </div>
    </MainLayout>
  );
};

export default UserPage;
