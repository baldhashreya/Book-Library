import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { User, UserFormData } from "../../../types/user";
import "./EditProfileModal.css";
import "../../../shared/styles/model.css";
import FormAction from "../../../shared/components/FormAction";
import Grid from "@mui/material/Grid";
import ModalHeader from "../../../shared/components/ModalHeader";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: UserFormData) => void;
  user: User;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  role: Yup.string().required("Role is required"),
  status: Yup.string().required("Status is required"),
  phone: Yup.number().required("Phone is required"),
  address: Yup.string().required("Address is required"),
});

const EditProfileModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
}) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      role: "",
      status: "active" as "active" | "inactive",
      phone: 0,
      address: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await onSave(values as UserFormData);
        onClose();
      } catch (err) {
        console.error("Error saving user:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      formik.setValues({
        name: user.name,
        email: user.email,
        role: user.role._id,
        status: user.status as any,
        phone: user.contactInfo && user.contactInfo.phone ? user.contactInfo.phone : 0,
        address: user.contactInfo && user.contactInfo.address ? user.contactInfo.address : "",
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content-user">
        <ModalHeader title="Edit User" onClose={onClose} disabled={loading} />

        <form
          onSubmit={formik.handleSubmit}
          className="user-form"
        >
          <Grid
            container
            spacing={2}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <div className="form-group">
                <label htmlFor="name">Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  placeholder="Enter Name"
                  maxLength={30}
                  className={formik.touched.name && formik.errors.name ? "input-error" : ""}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.name}</div>
                )}
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  placeholder="Enter email address"
                  className={formik.touched.email && formik.errors.email ? "input-error" : ""}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.email}</div>
                )}
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  className={formik.touched.status && formik.errors.status ? "input-error" : ""}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {formik.touched.status && formik.errors.status && (
                  <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.status}</div>
                )}
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  type="number"
                  id="phone"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  placeholder="Enter phone"
                  className={formik.touched.phone && formik.errors.phone ? "input-error" : ""}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.phone}</div>
                )}
              </div>
            </Grid>
            <Grid size={12}>
              <div className="form-group">
                <label htmlFor="address">Address*</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  placeholder="Enter address"
                  className={formik.touched.address && formik.errors.address ? "input-error" : ""}
                />
                {formik.touched.address && formik.errors.address && (
                  <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.address}</div>
                )}
              </div>
            </Grid>
          </Grid>

          <FormAction
            loading={loading}
            onClose={onClose}
            label="Update User"
          />
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
