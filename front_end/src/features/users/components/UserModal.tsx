import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { User, UserFormData } from "../../../types/user";
import { userService } from "../userService";
import "./UserModal.css";
import { Grid, TextField, MenuItem } from "@mui/material";
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

  const customInputStyles = {
    "& .MuiInputBase-root": {
      fontSize: "14px", 
    },
    "& .MuiInputLabel-root": {
      fontSize: "14px", 
    },
    "& .MuiOutlinedInput-root": {
      "& input": {
        padding: "10px 14px", 
      },
    },
    "& .MuiSelect-select": {
      padding: "10px 14px !important", 
    },
    "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
      transform: "translate(14px, 10px) scale(1)", 
    }
  };

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
          <Grid
            container
            spacing={2}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name *"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
                placeholder="Enter Name"
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={(formik.touched.name && formik.errors.name) || ""}
                slotProps={{ htmlInput: { maxLength: 30 } }}
                sx={customInputStyles}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                id="role"
                name="role"
                label="Role *"
                value={formik.values.role || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={(formik.touched.role && formik.errors.role) || ""}
                sx={customInputStyles}
              >
                <MenuItem value="" disabled sx={{ fontSize: "14px" }}>-- Select Role --</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role.value} value={role.value} sx={{ fontSize: "14px" }}>
                    {role.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="email"
                id="email"
                name="email"
                label="Email *"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
                placeholder="Enter email address"
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={(formik.touched.email && formik.errors.email) || ""}
                sx={customInputStyles}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              {mode === "edit" && user && (
                <TextField
                  select
                  fullWidth
                  id="status"
                  name="status"
                  label="Status *"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  helperText={(formik.touched.status && formik.errors.status) || ""}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                id="phone"
                name="phone"
                label="Phone *"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
                placeholder="Enter phone"
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={(formik.touched.phone && formik.errors.phone) || ""}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Address *"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
                placeholder="Enter address"
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={(formik.touched.address && formik.errors.address) || ""}
                sx={customInputStyles}
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
