import React, { useState, useEffect } from "react";
import type { User, UserFormData } from "../../types/user";
import { userService } from "../../services/userService";
import "./RoleModal.css";
import CancelButton from "../common/Button/CancleButton";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import IconButtons from "../common/Button/IconButtons";
import CustomButton from "../common/Button/CustomButton";
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
  });
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadRoles();
      setError("");
      if (mode === "edit" && user) {
        console.log("Setting form data for edit mode:", user);

        // Extract role ID from user object - handle different data structures
        let roleId = "";
        if (typeof user.role === "string") {
          roleId = user.role;
        } else if (user.role && typeof user.role === "object") {
          roleId = (user.role as any).id || (user.role as any).value || "";
        }

        setFormData({
          name: user.name,
          email: user.email,
          role: roleId,
          status: user.status,
        });
      } else {
        setFormData({
          name: "",
          email: "",
          role: "",
          status: "active",
        });
      }
    }
  }, [isOpen, mode, user]);

  const loadRoles = async () => {
    try {
      const rolesData = await userService.getRolesForDropdown();
      console.log("Loaded roles:", rolesData);
      setRoles(rolesData);

      // Set default role if adding new user and roles are available
      if (mode === "add" && rolesData.length > 0 && !formData.role) {
        setFormData((prev) => ({ ...prev, role: rolesData[0].value }));
      }
    } catch (error) {
      console.error("Error loading roles:", error);
      setRoles([]);
    }
  };

  const handleChange = (
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
      setError("An error occurred while saving the user");
    } finally {
      setLoading(false);
    }
  };

  // Get the current role label for display
  const getCurrentRoleLabel = () => {
    if (mode === "edit" && user) {
      // Try different ways to get role name
      let roleName = "";

      if ((user as any).roleName) {
        roleName = (user as any).roleName;
      } else if (typeof user.role === "string") {
        // Find role name from roles dropdown
        const roleOption = roles.find((r) => r.value === user.role);
        roleName = roleOption ? roleOption.label : user.role;
      } else if (user.role && typeof user.role === "object") {
        roleName =
          (user.role as any).name || (user.role as any).label || "Unknown Role";
      }

      return roleName || "Unknown Role";
    }
    return "";
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{mode === "add" ? "Add New User" : "Edit User"}</h2>
          <IconButtons
            ariaLabel="Close"
            onClick={onClose}
            label={<ClearRoundedIcon />}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="user-form"
        >
          {error && <div className="error-message">{error}</div>}
          <Grid
            container
            spacing={2}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter Name"
                  maxLength={30}
                />
                <div className="char-count">{formData.name.length}/30</div>
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter email address"
                />
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <div className="form-group">
                <label htmlFor="role">Role *</label>

                {
                  mode === "edit" ?
                    // Display role as read-only in edit mode
                    <div className="read-only-field">
                      <input
                        type="text"
                        value={getCurrentRoleLabel()}
                        disabled
                        className="read-only-input"
                        placeholder="Loading role..."
                      />
                      <input
                        type="hidden"
                        name="role"
                        value={formData.role}
                      />
                    </div>
                    // Editable dropdown in add mode
                  : <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      disabled={loading || roles.length === 0}
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option
                          key={role.value}
                          value={role.value}
                        >
                          {role.label}
                        </option>
                      ))}
                    </select>

                }
                {mode === "add" && roles.length === 0 && (
                  <div className="field-help">Loading roles...</div>
                )}
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </Grid>
          </Grid>

          {mode === "edit" && user && (
            <div className="user-info">
              <div className="info-item">
                <strong>Created:</strong>{" "}
                {user.createdAt ?
                  new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
              </div>
              {user.lastLogin && (
                <div className="info-item">
                  <strong>Last Login:</strong>{" "}
                  {new Date(user.lastLogin).toLocaleString()}
                </div>
              )}
            </div>
          )}

          <div className="form-actions">
            <CancelButton
              onClick={onClose}
              disabled={loading}
            />
            <CustomButton
              variant="contained"
              onClick={() => {}}
              label={
                loading ? "Saving..."
                : mode === "add" ?
                  "Add User"
                : "Update User"
              }
              // className="action-button"
              type="submit"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
