import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Category, CategoryFormData } from "../../../types/category";
import "./CategoryModal.css";
import CancelButton from "../../../shared/components/Button/CancleButton";
import CustomButton from "../../../shared/components/Button/CustomButton";
import ModalHeader from "../../../shared/components/ModalHeader";

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

          <div className="form-group">
            <label htmlFor="name">Category Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              placeholder="Enter category name"
              maxLength={50}
              className={formik.touched.name && formik.errors.name ? "input-error" : ""}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.name}</div>
            )}
            <div className="char-count">{formik.values.name.length}/50</div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              className={formik.touched.status && formik.errors.status ? "input-error" : ""}
            >
              <option value="ACTIVE">Active</option>
              <option value="IN_ACTIVE">Inactive</option>
            </select>
            {formik.touched.status && formik.errors.status && (
              <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.status}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              rows={4}
              placeholder="Optional category description"
              maxLength={200}
              className={formik.touched.description && formik.errors.description ? "input-error" : ""}
            />
            {formik.touched.description && formik.errors.description && (
              <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.description}</div>
            )}
            <div className="char-count">
              {formik.values.description?.length || 0}/200
            </div>
          </div>

          {mode === "edit" && category?.bookCount !== undefined && (
            <div className="book-count-info">
              <span>This category contains {category.bookCount} book(s)</span>
            </div>
          )}

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
