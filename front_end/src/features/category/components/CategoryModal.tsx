import React, { useState } from "react";
import type { Category, CategoryFormData } from "../../../types/category";
import "./CategoryModal.css";
import ModelHeader from "../../../shared/components/FormHeader";
import AppTextField from "../../../shared/components/AppTextField";

import { useFormik } from "formik";
import FormAction from "../../../shared/components/FormAction";
import { categorySchema } from "./category.model";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: CategoryFormData) => void;
  category?: Category | null;
  mode: "add" | "edit";
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
  mode,
}) => {
  const [loading, setLoading] = useState(false);

  const initialValues: CategoryFormData =
    mode === "edit" && category ?
      {
        name: category.name,
        description: category.description || "",
        status: category.status || "ACTIVE",
      }
    : {
        name: "",
        description: "",
        status: "ACTIVE",
      };

  const formik = useFormik({
    initialValues,
    validationSchema: categorySchema,
    enableReinitialize: true,
    onSubmit: async (values, actions) => {
      try {
        setLoading(true);
        await onSave(values);
        onClose();
      } catch (err) {
        console.error(err);
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
          header={mode === "add" ? "Add New Category" : "Edit Category"}
          onClose={onClose}
          loading={loading}
        />

        <form
          onSubmit={formik.handleSubmit}
          className="category-form"
        >
          {/* Name */}
          <AppTextField
            label="Category Name"
            placeholder="Enter category name"
            {...fieldProps("name")}
            inputProps={{ maxLength: 50 }}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            disabled={loading}
            fullWidth
          />
          <div className="char-count">{formik.values.name.length}/50</div>

          {/* Status */}
          <AppTextField
            label="Status"
            select
            SelectProps={{ native: true }}
            {...fieldProps("status")}
          >
            <option value="ACTIVE">Active</option>
            <option value="IN_ACTIVE">Inactive</option>
          </AppTextField>

          {/* Description */}
          <AppTextField
            label="Description"
            multiline
            rows={4}
            placeholder="Optional category description"
            {...fieldProps("description")}
            inputProps={{ maxLength: 200 }}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            disabled={loading}
            fullWidth
          />
          <div className="char-count">
            {formik.values.description.length}/200
          </div>

          {/* Book count info */}
          {mode === "edit" && category?.bookCount !== undefined && (
            <div className="book-count-info">
              This category contains {category.bookCount} book(s)
            </div>
          )}

          <FormAction
            onClose={onClose}
            loading={loading}
            label={mode === "add" ? "Add Category" : "Update Category"}
          />
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
