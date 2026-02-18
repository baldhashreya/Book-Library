import React, { useState, useEffect } from "react";
import MainLayout from "../../../shared/layouts/MainLayout";
import AddIcon from "@mui/icons-material/Add";
import CustomButton from "../../../shared/components/Button/CustomButton";
import "../../../shared/styles/button.css";
import "./RolePage.css";
import DataTable from "../../../shared/components/DataTable";
import { toast } from "react-toastify";
import { roleService } from "../roleService";
import type { Role, SearchParams } from "../../../types/role";
import RoleModal from "../components/RoleModal";

const RolePage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedRow, setSelectedRow] = useState<string[] | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  useEffect(() => {
    loadRoles();
  }, [paginationModel]);

  const loadRoles = async () => {
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
  };

  const handleAddRole = () => {
    setModalMode("add");
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setModalMode("edit");
    setSelectedRole(role);
    setIsModalOpen(true);
  };
  const handleDelete = async () => {
    if (window.confirm(`Delete selected roles?`)) {
      try {
        await roleService.deleteRole(selectedRow[0]);
        await loadRoles();
      } catch (error) {
        console.error("Bulk delete error:", error);
        alert("Some deletions failed.");
      }
    }
  };

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
