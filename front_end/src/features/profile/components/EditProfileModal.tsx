import React, { useState } from "react";
import { useFormik } from "formik";
import type { User, UserFormData } from "../../../types/user";
import "./EditProfileModal.css";
import "../../../shared/styles/model.css";
import CustomButton from "../../../shared/components/Button/CustomButton";
import CancelButton from "../../../shared/components/Button/CancelButton";
import Grid from "@mui/material/Grid";
import ModelHeader from "../../../shared/components/FormHeader";
import AppTextField from "../../../shared/components/AppTextField";
import {
  Phone,
  Home,
  Person,
  SupervisorAccount,
  Email,
  FiberManualRecord,
} from "@mui/icons-material";
import { editProfileSchema } from "./edit-profile-validation";
import { toast } from "react-toastify";
import FormAction from "../../../shared/components/FormAction";

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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("An error occurred while saving the user");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formik = useFormik({
    initialValues: {
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role.name,
      phone:
        user.contactInfo && user.contactInfo.phone ? user.contactInfo.phone : 0,
      address:
        user.contactInfo && user.contactInfo.address ?
          user.contactInfo.address
        : "",
    },
    validationSchema: editProfileSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <ModelHeader
          header="Edit User"
          onClose={onClose}
          loading={loading}
        />

        <form
          onSubmit={formik.onSubmit}
          className="user-form"
        >
          <Grid
            container
            spacing={2}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <AppTextField
                label="Name"
                name="name"
                fullWidth
                value={formik.values.name}
                onChange={formik.handleChange}
                startIcon={<Person fontSize="small" />}
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
                label="Role"
                name="role"
                fullWidth
                value={formik.values.role}
                onChange={formik.handleChange}
                startIcon={<SupervisorAccount fontSize="small" />}
                required
                disabled={true}
                placeholder="Enter Role"
              />
            </Grid>
            <Grid size={12}>
              <AppTextField
                label="Email"
                name="email"
                fullWidth
                value={formik.values.email}
                onChange={formik.handleChange}
                startIcon={<Email fontSize="small" />}
                required
                disabled={true}
                placeholder="Enter Email"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <AppTextField
                label="Phone"
                name="phone"
                fullWidth
                value={formik.values.phone}
                onChange={formik.handleChange}
                startIcon={<Phone fontSize="small" />}
                required
                disabled={loading}
                placeholder="Enter phone"
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <AppTextField
                label="Status"
                name="status"
                fullWidth
                value={formik.values.status.toLocaleLowerCase()}
                onChange={formik.handleChange}
                startIcon={<FiberManualRecord fontSize="small" />}
                required
                disabled={true}
                placeholder="Enter phone"
              />
            </Grid>
            <Grid size={12}>
              <AppTextField
                label="Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                startIcon={<Home fontSize="small" />}
                required
                fullWidth
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
            label="Update User"
          />
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
