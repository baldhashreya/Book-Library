import React, { useState, useEffect } from "react";
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
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  useEffect(() => {
    loadUsers({ limit: 10, offset: 0 } as UsersSearchParams);
  }, []);

  const loadUsers = async (params: UsersSearchParams) => {
    try {
      setLoading(true);
      const usersData = await userService.getUsers(params);
      setUsers(usersData);
    } catch (error) {
      console.error("UserPage: Error loading users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handleChangeStatusUser = async () => {
    try {
      await userService.changeUserStatus(selectedRow);
      const updatedUser = await userService.getUsers({
        limit: 100,
        offset: 0,
      });
      setUsers(updatedUser);
    } catch (error) {
      console.error("Bulk charge status user error:", error);
      alert("Some deletions failed.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete selected users?`)) {
      try {
        await userService.deleteUser(selectedRow);
        const updatedUser = await userService.getUsers({
          limit: 100,
          offset: 0,
        });
        setUsers(updatedUser);
      } catch (error) {
        console.error("Bulk delete error:", error);
        alert("Some deletions failed.");
      }
    }
  };

  const handleSaveUser = async (data: UserFormData & { _id?: string }) => {
  try {
    if (modalMode === "edit" && selectedUser._id) {
      await userService.updateUser(selectedUser._id, data);
    } else {
      await userService.createUser(data);
    }

    loadUsers({ limit: 10, offset: 0 });
    setIsModalOpen(false);
  } catch (err) {
    console.error("Save user error:", err);
  }
};


  const getStatusBadge = (status: string) => {
    return status.toLowerCase() === "active" ? (
      <span className="status-badge status-active">Active</span>
    ) : (
      <span className="status-badge status-inactive">Inactive</span>
    );
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRow((prev) => (prev === id ? null : id));
  };

  return (
    <MainLayout>
      <div className="user-page">
        <div className="page-header">
          <div className="toolbar">
            <button
              className="add-user-btn"
              onClick={handleAddUser}
            >
              <span>+</span> Add User
            </button>

            <button
              className="delete-selected-btn"
              disabled={!selectedRow}
              onChange={() => toggleSelectRow(user._id)}
              onClick={() => {
                handleDelete();
              }}
            >
              Delete User
            </button>
            <button
              className="edit-selected-btn"
              disabled={!selectedRow}
              onClick={() => {
                const userToEdit = users.find((u) => u._id === selectedRow);
                if (userToEdit) handleEditUser(userToEdit);
              }}
            >
              Edit User
            </button>

            <button
              className="change-status-btn"
              disabled={!selectedRow}
              onClick={() => {
                handleChangeStatusUser();
              }}
            >
              Change Status
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRow === user._id}
                        onChange={() => toggleSelectRow(user._id)}
                      />
                    </td>

                    <td>
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.userName || "N/A"}
                    </td>

                    <td>{user.email || "N/A"}</td>

                    <td>
                      <span className="role-tag">
                        {user.role ? (user as any).role.name : "N/A"}
                      </span>
                    </td>

                    <td>{getStatusBadge(user.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
