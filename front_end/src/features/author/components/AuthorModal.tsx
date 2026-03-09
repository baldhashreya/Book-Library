import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Author, AuthorFormData } from "../../../types/author";
import "./AuthorModal.css";
import CustomButton from "../../../shared/components/Button/CustomButton";
import CancelButton from "../../../shared/components/Button/CancleButton";
import { Grid } from "@mui/material";
import ModalHeader from "../../../shared/components/ModalHeader";

interface AuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (authorData: AuthorFormData) => void;
  author?: Author | null;
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
  author,
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

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && author) {
        formik.setValues({
          name: author.name,
          bio: author.bio || "",
          birthDate: author.birthDate,
        });
      } else {
        formik.setValues({
          name: "",
          bio: "",
          birthDate: "",
        });
        formik.setTouched({});
        formik.setErrors({});
      }
    }
  }, [isOpen, mode, author]);

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

          <div className="form-actions">
            <CancelButton
              onClick={onClose}
              disabled={loading}
            />
            <CustomButton
              variant="contained"
              type="submit"
              label={
                loading ? "Saving..."
                : mode === "add" ?
                  "Add Author"
                : "Update Author"
              }
              className="action-button"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthorModal;
