import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Category, CategoryFormData } from "../../../types/category";
import "./CategoryModal.css";
import CancelButton from "../../../shared/components/Button/CancleButton";
import CustomButton from "../../../shared/components/Button/CustomButton";
import ModalHeader from "../../../shared/components/ModalHeader";
import { Grid, TextField, MenuItem } from "@mui/material";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: CategoryFormData) => void;
  category?: Category | null;
  mode: "add" | "edit";
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Category name is required")
    .max(50, "Category name must be at most 50 characters"),
  description: Yup.string()
    .required("Category description is required")
    .max(200, "Description must be at most 200 characters"),
  status: Yup.string()
    .oneOf(["ACTIVE", "IN_ACTIVE"])
    .required("Category status is required"),
});

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
  mode,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      status: "ACTIVE" as "ACTIVE" | "IN_ACTIVE",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        await onSave(values as CategoryFormData);
        onClose();
      } catch (error) {
        console.error("Error saving category:", error);
        setError("An error occurred while saving the category");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      setError("");
      if (mode === "edit" && category) {
        formik.setValues({
          name: category.name,
          description: category.description || "",
          status: category.status as "ACTIVE" | "IN_ACTIVE" || "ACTIVE",
        });
      } else {
        formik.setValues({
          name: "",
          description: "",
          status: "ACTIVE",
        });
        formik.setTouched({});
        formik.setErrors({});
      }
    }
  }, [isOpen, mode, category]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <ModalHeader
          title={mode === "add" ? "Add New Category" : "Edit Category"}
          onClose={onClose}
        />

        <form
          onSubmit={formik.handleSubmit}
          className="category-form"
        >
          {error && <div className="error-message">{error}</div>}

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Category Name *"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={(formik.touched.name && formik.errors.name) || `${formik.values.name.length}/50`}
                disabled={loading}
                placeholder="Enter category name"
                slotProps={{ htmlInput: { maxLength: 50 } }}
                variant="outlined"
                sx={{
                  "& .MuiInputBase-root": { fontSize: "14px" },
                  "& .MuiInputLabel-root": { fontSize: "14px" },
                  "& .MuiOutlinedInput-root input": { padding: "10px 14px" },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                id="status"
                name="status"
                label="Status *"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
                disabled={loading}
                sx={{
                  "& .MuiInputBase-root": { fontSize: "14px" },
                  "& .MuiInputLabel-root": { fontSize: "14px" },
                  "& .MuiSelect-select": { padding: "10px 14px !important" },
                  "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": { transform: "translate(14px, 10px) scale(1)" },
                }}
              >
                <MenuItem value="ACTIVE" sx={{ fontSize: "14px" }}>Active</MenuItem>
                <MenuItem value="IN_ACTIVE" sx={{ fontSize: "14px" }}>Inactive</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                id="description"
                name="description"
                label="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={(formik.touched.description && formik.errors.description) || `${formik.values.description?.length || 0}/200`}
                disabled={loading}
                placeholder="Optional category description"
                slotProps={{ htmlInput: { maxLength: 200 } }}
                sx={{
                  "& .MuiInputBase-root": { fontSize: "14px" },
                  "& .MuiInputLabel-root": { fontSize: "14px" },
                }}
              />
            </Grid>
          </Grid>

          {mode === "edit" && category?.totalBookCount !== undefined && (
            <div className="book-count-info" style={{ marginTop: '16px' }}>
              <span>
                {category.totalBookCount === 0
                  ? "No books added to this category yet."
                  : category.availableBookCount === 0
                  ? `This category contains ${category.totalBookCount} book(s), but none are currently available.`
                  : `This category contains ${category.totalBookCount} book(s) (${category.availableBookCount} available).`
                }
              </span>
            </div>
          )}

          <div className="form-actions" style={{ marginTop: '24px' }}>
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
                  "Add Category"
                : "Update Category"
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

export default CategoryModal;
