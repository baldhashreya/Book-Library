import React, { useState, useEffect } from "react";
import MainLayout from "../MainLayout";
import CategoryModal from "./CategoryModal";
import type { Category, CategoryFormData } from "../../types/category";
import { categoryService } from "../../services/categoryService";
import "./CategoryPage.css";
import type { SearchParams } from "../../types/role";
import { ArrowDown, ArrowUp } from "lucide-react";

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  // PAGINATION STATE
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // SORTING STATE
  const [orderBy, setOrderBy] = useState<"name" | "description" | "status">(
    "name"
  );
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");

  // Load books whenever page, limit, sorting changes
  useEffect(() => {
    loadCategories();
  }, [page, limit, orderBy, order]);

  const loadCategories = async () => {
    try {
      setLoading(true);

      const offset = (page - 1) * limit;

      const params: SearchParams = {
        limit,
        offset,
        order: [[orderBy, order]],
      };

      const response = await categoryService.searchCategories(params);
      setCategories(response.rows);
      setTotalCount(response.count);
    } catch (error) {
      console.error("Error loading books:", error);
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
    category: Category
  ) => {
    if (category?.bookCount && category.bookCount > 0) {
      alert(
        `Cannot delete category "${category.name}" because it contains ${category.bookCount} book(s). Please move or delete the books first.`
      );
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete the category "${category.name}"?`
      )
    ) {
      try {
        await categoryService.deleteCategory(categoryId);
        loadCategories();
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
      loadCategories();
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

  const toggleSelectRow = (id: string) => {
    setSelectedRow((prev) => (prev === id ? null : id));
  };

  const getSortArrow = (column: string) => {
    if (orderBy !== column) return "";

    return order === "ASC" ? (
      <ArrowUp
        size={16}
        strokeWidth={2}
      />
    ) : (
      <ArrowDown
        size={16}
        strokeWidth={2}
      />
    );
  };

  // PAGINATION ACTIONS
  const totalPages = Math.ceil(totalCount / limit);

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // SORT HANDLER
  const handleSort = (column: typeof orderBy) => {
    if (orderBy === column) {
      setOrder(order === "ASC" ? "DESC" : "ASC");
    } else {
      setOrderBy(column);
      setOrder("ASC");
    }
  };

  const filteredCategories = categories;

  return (
    <MainLayout>
      <div className="category-page">
        <div className="page-header">
          <div className="toolbar">
            <button
              className="add-category-btn"
              onClick={handleAddCategory}
            >
              Add New Category
            </button>
            <button
              className="delete-selected-btn"
              disabled={!selectedRow}
              title="Delete Category"
              onClick={() => {
                const categoryToEdit = categories.find(
                  (e) => e._id === selectedRow
                );
                handleDeleteCategory(selectedRow || "", categoryToEdit);
              }}
            >
              Delete Category
            </button>
            <button
              className="edit-selected-btn"
              disabled={!selectedRow}
              title="View/Edit Category"
              onClick={() => {
                const categoryToEdit = categories.find(
                  (e) => e._id === selectedRow
                );
                if (categoryToEdit) handleEditCategory(categoryToEdit);
              }}
            >
              Edit Category
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading categories...</p>
          </div>
        ) : (
          <div className="categories-table-container">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th onClick={() => handleSort("name")}>
                    Category Name{" "}
                    <span className="sort-arrow">{getSortArrow("name")}</span>
                  </th>
                  <th onClick={() => handleSort("description")}>
                    Description{" "}
                    <span className="sort-arrow">
                      {getSortArrow("description")}
                    </span>
                  </th>
                  <th onClick={() => handleSort("status")}>
                    Status{" "}
                    <span className="sort-arrow">{getSortArrow("status")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRow === category._id}
                        onChange={() => toggleSelectRow(category._id)}
                      />
                    </td>
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
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={prevPage}
              >
                Previous
              </button>

              <span className="page-info">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={nextPage}
              >
                Next
              </button>

              <select
                className="limit-select"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
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
