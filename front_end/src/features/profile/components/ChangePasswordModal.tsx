import React, { useState } from "react";
import { useFormik } from "formik";
import { Grid, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import { changePasswordSchema } from "./change-password-model.ts";
import "./ChangePasswordModal.css";
import "../../../shared/styles/model.css";
import ModelHeader from "../../../shared/components/FormHeader.tsx";
import AppTextField from "../../../shared/components/AppTextField";
import FormAction from "../../../shared/components/FormAction.tsx";

interface Props {
  onClose: () => void;
  onSave: (data: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
}

const ChangePasswordModal: React.FC<Props> = ({ onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const togglePassword = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (values, actions) => {
      try {
        setLoading(true);
        await onSave(values);
        actions.resetForm();
        toast.success("Password updated successfully!");
        onClose();
      } catch (err) {
        setLoading(false);
        console.error(err);
        toast.error("Failed to update password");
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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <ModelHeader
          header="Change Password"
          onClose={onClose}
        />

        <form
          className="user-form"
          onSubmit={formik.handleSubmit}
        >
          <Grid
            container
            spacing={2}
          >
            {/* Old Password */}
            <Grid size={12}>
              <AppTextField
                label="Old Password"
                type={showPassword.oldPassword ? "text" : "password"}
                placeholder="Enter old password"
                {...fieldProps("oldPassword")}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePassword("oldPassword")}
                        edge="end"
                      >
                        {showPassword.oldPassword ?
                          <VisibilityOff />
                        : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* New Password */}
            <Grid size={12}>
              <AppTextField
                label="New Password"
                type={showPassword.newPassword ? "text" : "password"}
                placeholder="Enter new password"
                {...fieldProps("newPassword")}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePassword("newPassword")}
                        edge="end"
                      >
                        {showPassword.newPassword ?
                          <VisibilityOff />
                        : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Confirm Password */}
            <Grid size={12}>
              <AppTextField
                label="Confirm Password"
                type={showPassword.confirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                {...fieldProps("confirmPassword")}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePassword("confirmPassword")}
                        edge="end"
                      >
                        {showPassword.confirmPassword ?
                          <VisibilityOff />
                        : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <FormAction
            loading={loading}
            onClose={onClose}
            label="Update Password"
          />
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
