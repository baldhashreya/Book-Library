import React, { useEffect, useState } from "react";
import type { User, UserFormData } from "../../../types/user";
import { userService } from "../userService";
import "./UserModal.css";
import { Grid, MenuItem } from "@mui/material";
import { useFormik } from "formik";
import ModelHeader from "../../../shared/components/FormHeader";
import AppTextField from "../../../shared/components/AppTextField";
import { UserValidationSchema } from "./user.model";
import FormAction from "../../../shared/components/FormAction";

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
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) loadRoles();
  }, [isOpen]);

  const loadRoles = async () => {
    const data = await userService.getRolesForDropdown();
    setRoles(data);
  };

  const initialValues: UserFormData =
    mode === "edit" && user ?
      {
        name: user.name,
        email: user.email,
        role: user.role._id,
        status: user.status,
        phone: user.contactInfo && user.contactInfo.phone ? user.contactInfo.phone: 0,
        address: user.contactInfo && user.contactInfo.address ? user.contactInfo.address : "",
      }
    : {
        name: "",
        email: "",
        role: "",
        status: "active",
        phone: 0,
        address: "",
      };

  const formik = useFormik({
    initialValues,
    validationSchema: UserValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, actions) => {
      try {
        setLoading(true);
        console.log("Submitting user data:", values);
        await onSave(values);
        actions.resetForm();
        onClose();
      } finally {
        setLoading(false);
        actions.setSubmitting(false);
      }
    },
  });

  const fieldProps = (name: keyof typeof formik.values) => ({
    name,
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched[name] && Boolean(formik.errors[name]),
    helperText: formik.touched[name] && formik.errors[name],
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <ModelHeader
          header={mode === "add" ? "Add New User" : "Edit User"}
          onClose={onClose}
          loading={loading}
        />

        <form
          onSubmit={formik.handleSubmit}
          className="user-form"
        >
          <Grid
            container
            spacing={2}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <AppTextField
                label="Name"
                {...fieldProps("name")}
                fullWidth
                required
                disabled={loading}
                placeholder="Enter name"
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <AppTextField
                label="Email"
                type="email"
                {...fieldProps("email")}
                required
                disabled={loading}
                placeholder="Enter email"
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <AppTextField
                label="Role"
                select
                fullWidth
                {...fieldProps("role")}
                required
                disabled={loading}
                placeholder="Select role"
                onBlur={formik.handleBlur}
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={formik.touched.role && formik.errors.role}
              >
                {roles.map((role) => (
                  <MenuItem
                    key={role.value}
                    value={role.value}
                  >
                    {role.label}
                  </MenuItem>
                ))}
              </AppTextField>
            </Grid>

            {mode === "edit" && (
              <Grid size={{ xs: 12, md: 4 }}>
                <AppTextField
                  label="Status"
                  select
                  fullWidth
                  {...fieldProps("status")}
                  required
                  disabled={loading}
                  placeholder="Select status"
                  onBlur={formik.handleBlur}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                  value={formik.values.status.toLocaleLowerCase()}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </AppTextField>
              </Grid>
            )}

            <Grid size={{ xs: 12, md: 4 }}>
              <AppTextField
                label="Phone"
                type="number"
                {...fieldProps("phone")}
                required
                disabled={loading}
                placeholder="Enter phone"
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>

            <Grid size={12}>
              <AppTextField
                label="Address"
                {...fieldProps("address")}
                fullWidth
                multiline
                rows={3}
                required
                disabled={loading}
                placeholder="Enter address"
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>
          </Grid>

          <FormAction
            loading={loading}
            onClose={onClose}
            label={
              loading ? "Saving..."
              : mode === "add" ?
                "Add User"
              : "Update User"
            }
          />
        </form>
      </div>
    </div>
  );
};

export default UserModal;
