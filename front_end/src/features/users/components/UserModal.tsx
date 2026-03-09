import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { User, UserFormData } from "../../../types/user";
import { userService } from "../userService";
import "./UserModal.css";
import CancelButton from "../../../shared/components/Button/CancleButton";
import CustomButton from "../../../shared/components/Button/CustomButton";
import { Grid } from "@mui/material";
import ModalHeader from "../../../shared/components/ModalHeader";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: UserFormData) => void;
  user?: User | null;
  mode: "add" | "edit";
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

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
  mode,
}) => {
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError("");
      try {
        await onSave(values as UserFormData);
        onClose();
      } catch (error) {
        console.error("Error saving user:", error);
        setError("An error occurred while saving the user");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadRoles();
      setError("");
      if (mode === "edit" && user) {
        formik.setValues({
          name: user.name,
          email: user.email,
          role: user.role._id,
          status: user.status as any,
          phone: user.contactInfo?.phone || 0,
          address: user.contactInfo?.address || "",
        });
      } else {
        formik.setValues({
          name: "",
          email: "",
          role: "",
          status: "active",
          phone: 0,
          address: "",
        });
        formik.setTouched({});
        formik.setErrors({});
      }
    }
  }, [isOpen, mode, user]);

  const loadRoles = async () => {
    try {
      const rolesData = await userService.getRolesForDropdown();
      setRoles(rolesData);

      // Set default role if adding new user and roles are available
      if (mode === "add" && rolesData.length > 0 && !formik.values.role) {
        formik.setFieldValue("role", rolesData[0].value);
      }
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content-user">
        <ModalHeader
          title={mode === "add" ? "Add New User" : "Edit User"}
          onClose={onClose}
        />

        <form
          onSubmit={formik.handleSubmit}
          className="user-form"
        >
          {error && <div className="error-message">{error}</div>}
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
                <label htmlFor="role">Role *</label>
                <select
                  id="role"
                  name="role"
                  value={formik.values.role || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  className={formik.touched.role && formik.errors.role ? "input-error" : ""}
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
                {formik.touched.role && formik.errors.role && (
                  <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.role}</div>
                )}
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
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
            <Grid size={{ xs: 12, md: 4 }}>
              {mode === "edit" && user && (
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
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
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

          <div className="form-actions">
            <CancelButton
              onClick={onClose}
              disabled={loading}
            />
            <CustomButton
              label={
                loading ? "Saving..."
                : mode === "add" ?
                  "Add User"
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
