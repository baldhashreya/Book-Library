import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "../../../shared/layouts/MainLayout";
import RoleModal from "../components/RoleModal";
import type { Role, RoleFormData, RoleSearchParams } from "../../../types/role";
import { roleService } from "../roleService";
import AddIcon from "@mui/icons-material/Add";
import CustomButton from "../../../shared/components/Button/CustomButton";
import "../../../shared/styles/button.css";
import DataTable from "../../../shared/components/DataTable";
import { toast } from "react-toastify";

interface SortModelItem {
  field: string;
  sort: 'asc' | 'desc' | null;
}

interface RoleSearchResponse {
  data?: {
    rows: Role[];
    count: number;
  };
  rows?: Role[];
  count?: number;
  message?: string;
}

const RolePage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [sortModel, setSortModel] = useState<SortModelItem[]>([]);

  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);
      const roleData = await roleService.searchRoles({
        offset: paginationModel.page * paginationModel.pageSize,
        limit: paginationModel.pageSize,
        order: sortModel.length > 0 ? [[sortModel[0].field, sortModel[0].sort]] : [],
      } as RoleSearchParams);
      const res = roleData as RoleSearchResponse;
      setRoles(res.data?.rows || res.rows || []);
      setTotalCount(res.data?.count || res.count || 0);
    } catch (error) {
      console.error("RolePage: Error loading roles:", error);
      setRoles([]);
      setTotalCount(0);
      toast.error("Error loading roles");
    } finally {
      setLoading(false);
    }
  }, [paginationModel.page, paginationModel.pageSize, sortModel]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const handleAddRole = useCallback(() => {
    setModalMode("add");
    setSelectedRole(null);
    setIsModalOpen(true);
  }, []);

  const handleEditRole = useCallback((role: Role) => {
    setModalMode("edit");
    setSelectedRole(role);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (roleId: string) => {
    if (window.confirm(`Delete this role?`)) {
      try {
        await roleService.deleteRole(roleId);
        toast.success("Role deleted successfully");
        await loadRoles();
      } catch (error) {
        const err = error as { message?: string };
        console.error("Delete error:", err);
        toast.error(err.message || "Deletion failed.");
      }
    }
  }, [loadRoles]);

  const handleSaveRole = async (data: RoleFormData) => {
    try {
      if (modalMode === "edit" && selectedRole?._id) {
        const response = await roleService.updateRole(selectedRole._id, data);
        const res = response as RoleSearchResponse;
        toast.success(res.message || "Role updated successfully");
      } else {
        const response = await roleService.createRole(data);
        const res = response as RoleSearchResponse;
        toast.success(res.message || "Role created successfully");
      }
      setIsModalOpen(false);
      await loadRoles();
    } catch (err) {
      const errorObj = err as { message?: string };
      console.error("Save role error:", errorObj);
      toast.error(errorObj.message || "An error occurred while saving the role");
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
            <p>Loading roles...</p>
          </div>
        : <div className="roles-table-container">
            <DataTable
              rows={roles}
              rowCount={totalCount}
              paginationModel={paginationModel}
              onPaginationChange={setPaginationModel}
              sortModel={sortModel}
              onSortModelChange={setSortModel}
              loading={loading}
              onEdit={handleEditRole}
              onDelete={(row) => handleDelete(row._id)}
              columns={[
                {
                  field: "name",
                  headerName: "Name",
                  flex: 1,
                  valueGetter: (_value: unknown, row: Role) => row.name || "N/A",
                },
                {
                  field: "description",
                  headerName: "Description",
                  flex: 1,
                  valueGetter: (_value: unknown, row: Role) => row.description || "N/A",
                },
              ]}
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
