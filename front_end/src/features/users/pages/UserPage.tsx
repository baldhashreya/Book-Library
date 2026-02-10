import React, { useState, useEffect } from "react";
import MainLayout from "../../../shared/layouts/MainLayout";
import UserModal from "../components/UserModal";
import type { SearchParams, User, UserFormData } from "../../../types/user";
import { userService } from "../userService";
import AddIcon from "@mui/icons-material/Add";
import SyncIcon from "@mui/icons-material/Sync";
import CustomButton from "../../../shared/components/Button/CustomButton";
import "../../../shared/styles/button.css";
import "./UserPage.css";
import DataTable from "../../../shared/components/DataTable";
import { toast } from "react-toastify";

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRow, setSelectedRow] = useState<string[] | null>(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  useEffect(() => {
    loadUsers();
  }, [paginationModel]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getUsers({
        offset: paginationModel.page,
        limit: paginationModel.pageSize,
      } as SearchParams);
      setUsers(usersData.rows);
      setTotalCount(usersData.count);
    } catch (error) {
      console.error("UserPage: Error loading users:", error);
      setUsers([]);
      setTotalCount(0);
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
      await userService.changeUserStatus(selectedRow[0]);
      await loadUsers();
    } catch (error) {
      console.error("Bulk charge status user error:", error);
      alert("Some deletions failed.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete selected users?`)) {
      try {
        await userService.deleteUser(selectedRow[0]);
        await loadUsers();
      } catch (error) {
        console.error("Bulk delete error:", error);
        alert("Some deletions failed.");
      }
    }
  };

  const handleSaveUser = async (data: UserFormData & { _id?: string }) => {
    try {
      if (modalMode === "edit" && selectedUser._id) {
        const response = await userService.updateUser(selectedUser._id, data);
        await loadUsers();
        setIsModalOpen(false);
        toast.success(response.message || "User updated successfully");
      } else {
        const response = await userService.createUser(data);
        toast.success(response.message || "User created successfully");
        await loadUsers();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Save user error:", err);
      toast.error(err.message || "An error occurred while saving the user");
    }
  };

  return (
    <MainLayout>
      <div className="user-page">
        <div className="page-header">
          <div className="toolbar">
            <CustomButton
              variant="contained"
              onClick={handleAddUser}
              label="Add User"
              className="add-selected-btn btn"
              startIcon={<AddIcon />}
            />

            <CustomButton
              className="change-status-btn btn"
              onClick={handleChangeStatusUser}
              label="Change Status"
              variant="contained"
              disabled={!selectedRow || selectedRow.length === 0}
              startIcon={<SyncIcon />}
            />
          </div>
        </div>

        {loading ?
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        : <div className="users-table-container">
            <DataTable
              rows={users}
              rowCount={totalCount}
              paginationModel={paginationModel}
              onPaginationChange={setPaginationModel}
              loading={loading}
              onEdit={handleEditUser}
              onDelete={(row) => {
                setSelectedRow([row._id]);
                handleDelete();
              }}
              columns={[
                {
                  field: "username",
                  headerName: "Username",
                  flex: 1,
                  valueGetter: (_value, row) =>
                    row.name || row.userName || "N/A",
                },
                {
                  field: "email",
                  headerName: "Email",
                  flex: 1,
                  valueGetter: (_value, row) => row.email || "N/A",
                },
                {
                  field: "role",
                  headerName: "Role",
                  flex: 1,
                  valueGetter: (_value, row) => row.role?.name || "N/A",
                },
                {
                  field: "status",
                  headerName: "Status",
                  flex: 1,
                  renderCell: (params) => (
                    <span
                      className={
                        params.value === "ACTIVE" ?
                          "status-badge status-active"
                        : "status-badge status-inactive"
                      }
                    >
                      {params.value}
                    </span>
                  ),
                },
              ]}
              checkboxSelection={true}
              disableMultipleRowSelection={true}
              onRowSelect={setSelectedRow}
            />
          </div>
        }

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
