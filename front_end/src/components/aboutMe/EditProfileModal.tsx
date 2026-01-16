import React, { useState, useEffect } from "react";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import type { User, UserFormData } from "../../types/user";
import { userService } from "../../services/userService";
import "../aboutMe/EditProfileModal.css";
import CustomButton from "../common/Button/CustomButton";
import CancelButton from "../common/Button/CancleButton";
import IconButtons from "../common/Button/IconButtons";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: UserFormData) => void;
  user: User;
}

const EditProfileModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
}) => {
  console.log(user);
  const [formData, setFormData] = useState<any>({
    firstName: "",
    lastName: "",
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
      setFormData({
        firstName: user.firstName || user.userName,
        lastName: user.lastName,
        email: user.email,
        role: user.role._id,
        status: user.status,
        phone:
          user.contactInfo && user.contactInfo.phone
            ? user.contactInfo.phone
            : 0,
        address:
          user.contactInfo && user.contactInfo.address
            ? user.contactInfo.address
            : "",
      });
    }
  }, [isOpen, user]);

  const loadRoles = async () => {
    try {
      const rolesData = await userService.getRolesForDropdown();
      setRoles(rolesData);
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
      if (!formData.firstName.trim()) {
        setError("First name is required");
        return;
      }

      if (!formData.lastName.trim()) {
        setError("Last name is required");
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
          <h2>Edit User</h2>

          <IconButtons
            onClick={onClose}
            label={<ClearRoundedIcon />}
            ariaLabel="Close"
            disabled={loading}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="user-form"
        >
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name*</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName || formData.userName}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter firstName"
                maxLength={30}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name*</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter lastName"
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

            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                type="string"
                id="phone"
                name="phone"
                value={formData.phone.toString()}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter lastName"
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
            <CancelButton onClick={onClose} />
            <CustomButton
              variant="contained"
              onClick={() => {}}
              label="Update User"
              className="action-button"
              type="submit"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
