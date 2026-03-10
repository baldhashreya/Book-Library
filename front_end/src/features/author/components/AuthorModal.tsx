import React, { useState } from "react";
import type { Author, AuthorFormData } from "../../../types/author";
import "./AuthorModal.css";
import "../../../shared/styles/model.css";
import * as Yup from "yup";
import { Grid } from "@mui/material";
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
              <div className="form-group">
                <label htmlFor="name">Author Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  className={formik.touched.name && formik.errors.name ? "input-error" : ""}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.name}</div>
                )}
              </div>
            </Grid>

            {/* Birth Date */}
            <Grid size={{ xs: 12, md: 6 }}>
              <div className="form-group">
                <label htmlFor="isbn">Birth Date *</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formik.values.birthDate as any}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  className={formik.touched.birthDate && formik.errors.birthDate ? "input-error" : ""}
                />
                {formik.touched.birthDate && formik.errors.birthDate && (
                  <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.birthDate as string}</div>
                )}
              </div>
            </Grid>

            {/* Bio */}
            <Grid size={12}>
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formik.values.bio}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  rows={4}
                  placeholder="Optional author bio"
                  className={formik.touched.bio && formik.errors.bio ? "input-error" : ""}
                />
                {formik.touched.bio && formik.errors.bio && (
                  <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.bio}</div>
                )}
              </div>
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
