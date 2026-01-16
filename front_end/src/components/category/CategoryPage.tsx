import React, { useState, useEffect } from "react";
import MainLayout from "../MainLayout";
import CategoryModal from "./CategoryModal";
import type { Category, CategoryFormData } from "../../types/category";
import { categoryService } from "../../services/categoryService";
import "./CategoryPage.css";
import type { SearchParams } from "../../types/role";
import CustomButton from "../common/Button/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import IconButtons from "../common/Button/IconButtons";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  useEffect(() => {
    loadCategories({ limit: 10, offset: 0 } as SearchParams);
  }, []);

  const loadCategories = async (params: SearchParams) => {
    try {
      setLoading(true);
      const categoriesData = await categoryService.searchCategories(params);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setModalMode("add");
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setModalMode("edit");
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (
    categoryId: string,
    categoryName: string
  ) => {
    const category = categories.find((cat) => cat._id === categoryId);

    if (category?.bookCount && category.bookCount > 0) {
      alert(
        `Cannot delete category "${categoryName}" because it contains ${category.bookCount} book(s). Please move or delete the books first.`
      );
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete the category "${categoryName}"?`
      )
    ) {
      try {
        await categoryService.deleteCategory(categoryId);
        const updatedCategories = await categoryService.searchCategories({
          limit: 10,
          offset: 0,
        } as SearchParams);
        setCategories(updatedCategories);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Error deleting category. Please try again.");
      }
    }
  };

  const handleSaveCategory = async (categoryData: CategoryFormData) => {
    try {
      if (modalMode === "add") {
        await categoryService.createCategory(categoryData);
      } else if (modalMode === "edit" && selectedCategory) {
        await categoryService.updateCategory(
          selectedCategory._id,
          categoryData
        );
      }
      const updatedCategories = await categoryService.searchCategories({
        limit: 10,
        offset: 0,
      } as SearchParams);
      setCategories(updatedCategories);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      throw error;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { class: "status-active", text: "Active" },
      IN_ACTIVE: { class: "status-inactive", text: "In active" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.ACTIVE;
    return (
      <span className={`status-badge ${config.class}`}>{config.text}</span>
    );
  };

  const filteredCategories = categories;

  return (
    <MainLayout>
      <div className="category-page">
        <div className="page-header">
          <CustomButton
            variant="contained"
            onClick={handleAddCategory}
            label="Add New Category"
            className="add-selected-btn btn"
            startIcon={<AddIcon />}
          />
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading categories...</p>
          </div>
        ) : (
          <div className="categories-table-container">
            {filteredCategories.length === 0 ? (
              <div className="empty-state">
                <h3>No categories found</h3>
                <p>
                  {
                    "No categories available. Add your first category to get started."
                  }
                </p>
              </div>
            ) : (
              <table className="categories-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Books Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category._id}>
                      <td>
                        <div className="category-name">
                          <strong>{category.name}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="category-description">
                          {category.description || "No description"}
                        </div>
                      </td>
                      <td>{getStatusBadge(category.status)}</td>
                      <td>
                        <div className="book-count">
                          <span
                            className={`count-badge ${
                              category.bookCount ? "has-books" : "no-books"
                            }`}
                          >
                            {category.bookCount || 0}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <IconButtons
                            onClick={() => handleEditCategory(category)}
                            label={<EditIcon />}
                            ariaLabel="edit"
                          />
                          <IconButtons
                            onClick={() =>
                              handleDeleteCategory(category._id, category.name)
                            }
                            label={<DeleteIcon />}
                            ariaLabel="Delete"
                            disabled={
                              category.bookCount
                                ? category.bookCount > 0
                                : false
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCategory}
          category={selectedCategory}
          mode={modalMode}
        />
      </div>
    </MainLayout>
  );
};

export default CategoryPage;
