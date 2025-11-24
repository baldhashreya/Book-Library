import React, { useState, useEffect } from "react";
import type { Category, CategoryFormData } from "../../types/category";
import "./CategoryModal.css";

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
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    status: "ACTIVE"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError("");
      if (mode === "edit" && category) {
        setFormData({
          name: category.name,
          description: category.description || "",
          status: category.status || "ACTIVE"
        });
      } else {
        setFormData({
          name: "",
          description: "",
          status: "ACTIVE"
        });
      }
    }
  }, [isOpen, mode, category]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate category name
      if (!formData.name.trim()) {
        setError("Category name is required");
        return;
      }

      if (!formData.description.trim()) {
        setError("Category description is required");
        return;
      }

      if(formData.status !== "ACTIVE" && formData.status !== "IN_ACTIVE") {
        setError("Category status is required");
        return;
      }
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
      setError("An error occurred while saving the category");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{mode === "add" ? "Add New Category" : "Edit Category"}</h2>
          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="category-form"
        >
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Category Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter category name"
              maxLength={50}
            />
            <div className="char-count">{formData.name.length}/50</div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="ACTIVE">Active</option>
                <option value="IN_ACTIVE">Inactive</option>
              </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              rows={4}
              placeholder="Optional category description"
              maxLength={200}
              required
            />
            <div className="char-count">
              {formData.description?.length || 0}/200
            </div>
          </div>

          {mode === "edit" && category?.bookCount !== undefined && (
            <div className="book-count-info">
              <span>
                This category contains {category.bookCount} book(s)
              </span>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : mode === "add"
                ? "Add Category"
                : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
