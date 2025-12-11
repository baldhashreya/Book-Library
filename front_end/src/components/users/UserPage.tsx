import React, { useState, useEffect } from "react";
import MainLayout from "../MainLayout";
import UserModal from "../users/UserModal";
import type { User, UserFormData, UsersSearchParams } from "../../types/user";
import { userService } from "../../services/userService";
import "./UserPage.css";
import BorrowHistoryModal from "./BorrowHistoryModal";
import type { SearchParams } from "../../types/role";
import { ArrowDown, ArrowUp } from "lucide-react";

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [orderBy, setOrderBy] = useState<
    "username" | "email" | "role" | "status"
  >("status");
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");

  useEffect(() => {
    loadUsers();
  }, [page, limit, orderBy, order]);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const offset = (page - 1) * limit;

      const params: SearchParams = {
        limit,
        offset,
        order: [[orderBy, order]],
      };

      const response = await userService.getUsers(params);

      setUsers(response.rows);
      setTotalCount(response.count);
    } catch (error) {
      console.error("Error loading books:", error);
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
      loadUsers();
    } catch (error) {
      console.error("Bulk charge status user error:", error);
      alert("Some deletions failed.");
    }
  };

  const handleUserBorrowHistory = async () => {
    try {
      const history = await userService.userBorrowHistory(selectedRow);
      setBorrowHistory(history); // store data
      setIsHistoryModalOpen(true); // open modal
    } catch (error) {
      console.error("Error fetching borrow history:", error);
      alert("Failed to load borrow history.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete selected users?`)) {
      try {
        await userService.deleteUser(selectedRow);
        loadUsers();
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

      loadUsers();
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

  const getSortArrow = (column: string) => {
    if (orderBy !== column) return "";

    return order === "ASC" ? (
      <ArrowUp
        size={16}
        strokeWidth={2}
      />
    ) : (
      <ArrowDown
        size={16}
        strokeWidth={2}
      />
    );
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRow((prev) => (prev === id ? null : id));
  };

  const totalPages = Math.ceil(totalCount / limit);
  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleSort = (column: typeof orderBy) => {
    if (orderBy === column) {
      setOrder(order === "ASC" ? "DESC" : "ASC");
    } else {
      setOrderBy(column);
      setOrder("ASC");
    }
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
              Add User
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

            <button
              className="borrow-history-btn"
              disabled={!selectedRow}
              onClick={() => {
                handleUserBorrowHistory();
              }}
            >
              Borrow History
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
                  <th onClick={() => handleSort("username")}>
                    Username{" "}
                    <span className="sort-arrow">
                      {getSortArrow("username")}
                    </span>
                  </th>
                  <th onClick={() => handleSort("email")}>
                    Email{" "}
                    <span className="sort-arrow">{getSortArrow("email")}</span>
                  </th>
                  <th onClick={() => handleSort("role")}>
                    Role{" "}
                    <span className="sort-arrow">{getSortArrow("role")}</span>
                  </th>
                  <th onClick={() => handleSort("status")}>
                    Status{" "}
                    <span className="sort-arrow">{getSortArrow("status")}</span>
                  </th>
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
                        {user.role ? (user as any).role : "N/A"}
                      </span>
                    </td>

                    <td>{getStatusBadge(user.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={prevPage}
              >
                Previous
              </button>

              <span className="page-info">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={nextPage}
              >
                Next
              </button>

              <select
                className="limit-select"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        )}

        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
          user={selectedUser}
          mode={modalMode}
        />

        <BorrowHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          history={borrowHistory}
        />
      </div>
    </MainLayout>
  );
};

export default UserPage;
