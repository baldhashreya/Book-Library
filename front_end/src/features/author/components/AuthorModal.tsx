import React, { useState } from "react";
import type { AuthorFormData } from "../../../types/author";
import "./AuthorModal.css";
import "../../../shared/styles/model.css";
import * as Yup from "yup";
import { Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import ModalHeader from "../../../shared/components/ModalHeader";
import FormAction from "../../../shared/components/FormAction";

interface AuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (authorData: AuthorFormData) => void;
  mode: "add" | "edit";
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Author Name is required"),
  bio: Yup.string(),
  birthDate: Yup.date().required("Birth Date is required"),
});

const AuthorModal: React.FC<AuthorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode,
}) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      bio: "",
      birthDate: "" as any,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await onSave(values as AuthorFormData);
        onClose();
      } catch (error) {
        console.error("Error saving author:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <ModalHeader
          title={mode === "add" ? "Add New Author" : "Edit Author"}
          onClose={onClose}
          disabled={loading}
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
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Author Name *"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={(formik.touched.name && formik.errors.name) || ""}
              />
            </Grid>

            {/* Birth Date */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                id="birthDate"
                name="birthDate"
                label="Birth Date *"
                value={formik.values.birthDate as any}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
                slotProps={{ inputLabel: { shrink: true } }}
                error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
                helperText={(formik.touched.birthDate && formik.errors.birthDate) ? (formik.errors.birthDate as string) : ""}
              />
            </Grid>

            {/* Bio */}
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                id="bio"
                name="bio"
                label="Bio"
                value={formik.values.bio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
                placeholder="Optional author bio"
                error={formik.touched.bio && Boolean(formik.errors.bio)}
                helperText={(formik.touched.bio && formik.errors.bio) || ""}
              />
            </Grid>
          </Grid>

          <FormAction
            loading={loading}
            onClose={onClose}
            label={mode === "add" ? "Add Author" : "Update Author"}
          />
        </form>
      </div>
    </div>
  );
};

export default AuthorModal;
