import React, { useState, useEffect, useCallback } from "react";
import type { User, UserFormData } from "../../../types/user";
import { userService } from "../../users/userService";
import "./RoleModal.css";
import CancelButton from "../../../shared/components/Button/CancleButton";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import IconButtons from "../../../shared/components/Button/IconButtons";
import CustomButton from "../../../shared/components/Button/CustomButton";
import { Grid } from "@mui/material";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: UserFormData) => void;
  user?: User | null;
  mode: "add" | "edit";
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
  mode,
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "",
    status: "active",
    phone: 0,
    address: "",
  });

  useEffect(() => {
    loadRoles();
  }, [paginationModel]);

  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);
      const roleData = await roleService.searchRoles({
        offset: paginationModel.page,
        limit: paginationModel.pageSize,
      } as SearchParams);
      setRoles(roleData.data.rows);
      setTotalCount(roleData.data.count);
    } catch (error) {
      console.error("RolePage: Error loading roles:", error);
      setRoles([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [mode, formData.role]);

  useEffect(() => {
    if (isOpen) {
      loadRoles();
      // ... rest of logic
    }
  }, [isOpen, loadRoles]); // Add loadRoles here 

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Don't allow role changes in edit mode
    if (mode === "edit" && name === "role") {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  }, [mode, error]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate form
      if (!formData.name.trim()) {
        setError("Name is required");
        return;
      }

      if (!formData.email.trim()) {
        setError("Email is required");
        return;
      }

      if (!formData.role) {
        setError("Role is required");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        return;
      }
    }
  }, [formData, onSave, onClose]);

  const handleSaveRole = async (data: Role & { _id?: string }) => {
    try {
      if (modalMode === "edit" && selectedRole._id) {
        const response = await roleService.updateRole(selectedRole._id, data);
        await loadRoles();
        setIsModalOpen(false);
        toast.success(response.message || "Role updated successfully");
      } else {
        const response = await roleService.createRole(data);
        toast.success(response.message || "Role created successfully");
        await loadRoles();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Save role error:", err);
      toast.error(err.message || "An error occurred while saving the role");
    }
  };

  return (
    <MainLayout>
      <div className="user-page">
        <div className="page-header">
          <div className="toolbar">
            <CustomButton
              variant="contained"
              onClick={handleAddRole}
              label="Add Role"
              className="add-selected-btn btn"
              startIcon={<AddIcon />}
            />
          </div>
        </div>

        {loading ?
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        : <div className="roles-table-container">
            <DataTable
              rows={roles}
              rowCount={totalCount}
              paginationModel={paginationModel}
              onPaginationChange={setPaginationModel}
              loading={loading}
              onEdit={handleEditRole}
              onDelete={(row) => {
                setSelectedRow([row._id]);
                handleDelete();
              }}
              columns={[
                {
                  field: "name",
                  headerName: "Name",
                  flex: 1,
                  valueGetter: (_value, row) => row.name || "N/A",
                },

                {
                  field: "description",
                  headerName: "Description",
                  flex: 1,
                  valueGetter: (_value, row) => row.description || "N/A",
                },
              ]}
              checkboxSelection={true}
              disableMultipleRowSelection={true}
              onRowSelect={setSelectedRow}
            />
          </div>
        }

        <RoleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveRole}
          role={selectedRole}
          mode={modalMode}
        />
      </div>
    </MainLayout>
  );
};

export default RolePage;
