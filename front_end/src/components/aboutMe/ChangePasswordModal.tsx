import { useState } from "react";
import "./ChangePasswordModal.css";

const ChangePasswordModal = ({ onClose, onSave }: any) => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onSave(form.newPassword);
      onClose();
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Change Password</h2>

        <div className="form-grid">
          <label>Old Password</label>
          <input
            type="password"
            name="oldPassword"
            onChange={handleChange}
          />

          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            onChange={handleChange}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            onChange={handleChange}
          />
        </div>

        <div className="modal-actions">
          <button
            className="save-btn"
            onClick={handleSubmit}
          >
            Update
          </button>
          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
