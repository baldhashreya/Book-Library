import React, { useState, useEffect } from "react";
import type { User, UserFormData } from "../../types/user";
import { userService } from "../../services/userService";
import "./UserModal.css";
import CancelButton from "../common/Button/CancleButton";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import CustomButton from "../common/Button/CustomButton";
import IconButtons from "../common/Button/IconButtons";

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
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadRoles();
      setError("");
      if (mode === "edit" && user) {
        setFormData({
          name: user.name,
          email: user.email,
          role: user.role._id,
          status: user.status,
          phone: user.phone,
          address: user.address,
        });
      } else {
        setFormData({
          name: "",
          email: "",
          role: "",
          phone: 0,
          address: "",
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
    console.log(formData);
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content-user">
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name*</label>
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
            </div>

            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <select
                id="role"
                name="role"
                value={formData.role || ""}
                onChange={(e) => {
                  const selectedRoleId = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    role: selectedRoleId,
                  }));
                }}
                disabled={loading}
                required
              >
                <option
                  value=""
                  disabled
                  hidden
                >
                  -- Select Role --
                </option>
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
          </div>

          <div className="form-row">
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
            {mode === "edit" && user && (
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
            )}

            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                type="number"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter phone"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address">Address*</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter address"
              />
            </div>
          </div>

          <div className="form-actions">
            <CancelButton
              onClick={onClose}
              disabled={loading}
            />
            <CustomButton
              label={
                loading
                  ? "Saving..."
                  : mode === "add"
                  ? "Add User"
                  : "Update User"
              }
              variant="contained"
              disabled={loading}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
