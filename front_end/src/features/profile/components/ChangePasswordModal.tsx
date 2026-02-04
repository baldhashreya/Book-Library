import { useState } from "react";
import "./ChangePasswordModal.css";
import CustomButton from "../../../shared/components/Button/CustomButton";
import CancelButton from "../../../shared/components/Button/CancleButton";

const ChangePasswordModal = ({ onClose, onSave }: any) => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent): void => {
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
            required
          />

          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            onChange={handleChange}
            required
          />
        </div>

        <div className="modal-actions">
          <CustomButton
            variant="contained"
            onClick={handleSubmit}
            label="Update"
            className="update-button"
          />
          <CancelButton onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
