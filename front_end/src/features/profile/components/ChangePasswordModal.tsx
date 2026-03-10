import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./ChangePasswordModal.css";
import FormAction from "../../../shared/components/FormAction";
import ModalHeader from "../../../shared/components/ModalHeader";

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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              className={formik.touched.oldPassword && formik.errors.oldPassword ? "input-error" : ""}
            />
            {formik.touched.oldPassword && formik.errors.oldPassword && (
              <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.oldPassword as string}</div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              className={formik.touched.newPassword && formik.errors.newPassword ? "input-error" : ""}
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.newPassword as string}</div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              className={formik.touched.confirmPassword && formik.errors.confirmPassword ? "input-error" : ""}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.confirmPassword as string}</div>
            )}
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
