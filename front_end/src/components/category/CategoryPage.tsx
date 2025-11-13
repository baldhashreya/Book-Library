import React, { useState, useEffect } from "react";
import MainLayout from "../MainLayout";
import CategoryModal from "./CategoryModal";
import type { Category, CategoryFormData } from "../../types/category";
import { categoryService } from "../../services/categoryService";
import "./CategoryPage.css";

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await categoryService.getCategories();
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
    const category = categories.find((cat) => cat.id === categoryId);

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
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Error deleting category. Please try again.");
      }
    }
  };

  const handleSaveCategory = async (categoryData: CategoryFormData) => {
    try {
      if (modalMode === "add") {
        const newCategory = await categoryService.addCategory(categoryData);
        setCategories((prev) => [...prev, newCategory]);
      } else if (modalMode === "edit" && selectedCategory) {
        const updatedCategory = await categoryService.updateCategory(
          selectedCategory.id,
          categoryData
        );
        if (updatedCategory) {
          setCategories((prev) =>
            prev.map((cat) =>
              cat.id === selectedCategory.id ? updatedCategory : cat
            )
          );
        }
      }
    } catch (error) {
      console.error("Error saving category:", error);
      throw error;
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <MainLayout>
      <div className="category-page">
        <div className="page-header">
          <div className="header-content">
            <h1>Category Management</h1>
            <p>Manage your book categories</p>
          </div>
          <button
            className="add-category-btn"
            onClick={handleAddCategory}
          >
            <span>+</span>
            Add New Category
          </button>
        </div>

        <div className="category-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search categories by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="category-stats">
            <span>Total Categories: {categories.length}</span>
            <span>
              Total Books:{" "}
              {categories.reduce((sum, cat) => sum + (cat.bookCount || 0), 0)}
            </span>
          </div>
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
                <div className="empty-icon">📑</div>
                <h3>No categories found</h3>
                <p>
                  {searchTerm
                    ? "No categories match your search criteria. Try adjusting your search."
                    : "No categories available. Add your first category to get started."}
                </p>
                {!searchTerm && (
                  <button
                    className="add-category-btn"
                    onClick={handleAddCategory}
                  >
                    Add Your First Category
                  </button>
                )}
              </div>
            ) : (
              <table className="categories-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th>Books Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id}>
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
                          <button
                            className="action-btn view-btn"
                            onClick={() => handleEditCategory(category)}
                            title="View/Edit Category"
                          >
                            👁️
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() =>
                              handleDeleteCategory(category.id, category.name)
                            }
                            title="Delete Category"
                            disabled={
                              category.bookCount
                                ? category.bookCount > 0
                                : false
                            }
                          >
                            🗑️
                          </button>
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
