import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { User, UserFormData } from "../../../types/user";
import "./EditProfileModal.css";
import "../../../shared/styles/model.css";
import FormAction from "../../../shared/components/FormAction";
import { Grid, TextField, MenuItem } from "@mui/material";
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
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
              />
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
