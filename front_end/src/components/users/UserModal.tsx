import React, { useState, useEffect } from "react";
import type { User, UserFormData } from "../../types/user";
import { userService } from "../../services/userService";
import "./UserModal.css";

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
    userName: "",
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
        setFormData({
          userName: user.userName,
          email: user.email,
          role: user.role.name,
          status: user.status,
        });
      } else {
        setFormData({
          userName: "",
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
      setRoles(rolesData);

      // Set default role if adding new user and roles are available
      if (mode === "add" && rolesData.length > 0 && !formData.role) {
        setFormData((prev) => ({ ...prev, role: rolesData[0].value }));
      }
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
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
      if (!formData.userName.trim()) {
        setError("Username is required");
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{mode === "add" ? "Add New User" : "Edit User"}</h2>
          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="user-form"
        >
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="userName">Username *</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter username"
                maxLength={30}
              />
            </div>

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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <select
                id="role"
                name="role"
                value={formData.role.name}
                onChange={handleChange}
                required
                disabled
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
            </div>

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
          </div>

          {mode === "edit" && user && (
            <div className="user-info">
              <div className="info-item">
                <strong>Created:</strong> {user.createdAt}
              </div>
              {user.lastLogin && (
                <div className="info-item">
                  <strong>Last Login:</strong> {user.lastLogin}
                </div>
              )}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : mode === "add"
                ? "Add User"
                : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
