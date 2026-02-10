import React, { useState } from "react";
import type { Author, AuthorFormData } from "../../../types/author";
import "./AuthorModal.css";
import "../../../shared/styles/model.css";

import { Grid } from "@mui/material";
import { useFormik } from "formik";
import ModelHeader from "../../../shared/components/FormHeader";
import AppTextField from "../../../shared/components/AppTextField";
import { authorSchema } from "./author.model";
import FormAction from "../../../shared/components/FormAction";

interface AuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (authorData: AuthorFormData) => void;
  author?: Author | null;
  mode: "add" | "edit";
}

const AuthorModal: React.FC<AuthorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  author,
  mode,
}) => {
  const [loading, setLoading] = useState(false);

  const initialValues: AuthorFormData = {
    name: mode === "edit" && author ? author.name : "",
    bio: mode === "edit" && author ? author.bio : "",
    birthDate:
      mode === "edit" && author ?
        author.birthDate
      : new Date().toISOString().split("T")[0],
  };

  const formik = useFormik({
    initialValues,
    validationSchema: authorSchema,
    enableReinitialize: true,
    onSubmit: async (values, actions) => {
      try {
        setLoading(true);
        await onSave(values);
        actions.resetForm();
        onClose();
      } catch (error) {
        console.error("Error saving author:", error);
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
          header={mode === "add" ? "Add New Author" : "Edit Author"}
          onClose={onClose}
          loading={loading}
        />

        <form
          onSubmit={formik.handleSubmit}
          className="author-form"
        >
          <Grid
            container
            spacing={2}
          >
            {/* Author Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <AppTextField
                label="Author Name"
                required
                placeholder="Enter author name"
                {...fieldProps("name")}
                disabled={loading}
              />
            </Grid>

            {/* Birth Date */}
            <Grid size={{ xs: 12, md: 6 }}>
              <AppTextField
                label="Birth Date"
                type="date"
                required
                InputLabelProps={{ shrink: true }}
                {...fieldProps("birthDate")}
                disabled={loading}
              />
            </Grid>

            {/* Bio */}
            <Grid size={12}>
              <AppTextField
                label="Bio"
                multiline
                fullWidth
                required
                rows={4}
                placeholder="Optional author bio"
                {...fieldProps("bio")}
                disabled={loading}
              />
            </Grid>
          </Grid>

          <FormAction
            onClose={onClose}
            loading={loading}
            label={mode === "add" ? "Add Author" : "Update Author"}
          />
        </form>
      </div>
    </div>
  );
};

export default AuthorModal;
