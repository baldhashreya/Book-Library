import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./ChangePasswordModal.css";
import FormAction from "../../../shared/components/FormAction";
import ModalHeader from "../../../shared/components/ModalHeader";
import { TextField } from "@mui/material";

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), undefined], 'Passwords must match')
    .required('Confirm Password is required'),
});

const ChangePasswordModal = ({ onClose, onSave }: any) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await onSave(values.newPassword);
        onClose();
      } catch (err) {
        console.error("Error setting password:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <ModalHeader title="Change Password" onClose={onClose} />

        <form className="form-grid" onSubmit={formik.handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
            <TextField
              fullWidth
              type="password"
              id="oldPassword"
              name="oldPassword"
              label="Old Password *"
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
              helperText={(formik.touched.oldPassword && formik.errors.oldPassword) || ""}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
            <TextField
              fullWidth
              type="password"
              id="newPassword"
              name="newPassword"
              label="New Password *"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
              helperText={(formik.touched.newPassword && formik.errors.newPassword) || ""}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
            <TextField
              fullWidth
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password *"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={(formik.touched.confirmPassword && formik.errors.confirmPassword) || ""}
            />
          </div>
          <FormAction
            loading={loading}
            onClose={onClose}
            label="Update"
          />
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
