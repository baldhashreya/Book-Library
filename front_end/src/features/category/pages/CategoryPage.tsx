import React, { useState, useEffect } from "react";
import MainLayout from "../../../shared/layouts/MainLayout";
import CategoryModal from "../components/CategoryModal";
import type { Category, CategoryFormData } from "../../../types/category";
import { categoryService } from "../categoryService";
import "./CategoryPage.css";
import CustomButton from "../../../shared/components/Button/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import DataTable from "../../../shared/components/DataTable";

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<string[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  useEffect(() => {
    loadCategories();
  }, [paginationModel]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await categoryService.searchCategories({
        offset: paginationModel.page,
        limit: paginationModel.pageSize,
      });

      setCategories(categoriesData.rows);
      setTotalCount(categoriesData.count);
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

  const handleDeleteCategory = async () => {
    const category = categories.find((cat) => cat._id === selectedRow[0]);
    if (!category) {
      alert("Category not found.");
      return;
    }

    if (category?.bookCount && category.bookCount > 0) {
      alert(
        `Cannot delete category "${category.name}" because it contains ${category.bookCount} book(s). Please move or delete the books first.`,
      );
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete the category "${categoryName}"?`,
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
          categoryData,
        );
      }
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

        {loading ?
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading categories...</p>
          </div>
        : <div className="categories-table-container">
            <DataTable
              rows={filteredCategories}
              rowCount={totalCount}
              paginationModel={paginationModel}
              onPaginationChange={setPaginationModel}
              loading={loading}
              onEdit={handleEditCategory}
              onDelete={(row) => {
                setSelectedRow([row._id]);
                handleDeleteCategory();
              }}
              columns={[
                {
                  field: "name",
                  headerName: "Category Name",
                  flex: 1,
                  valueGetter: (_value, row) => row.name || "",
                },
                {
                  field: "description",
                  headerName: "Description",
                  flex: 1,
                  valueGetter: (_value, row) => row.description || "",
                },
                {
                  field: "status",
                  headerName: "Status",
                  flex: 1,
                  renderCell: (params) =>
                    // <span
                    //   className={
                    //     params.value === "ACTIVE" ?
                    //       "status-badge status-active"
                    //     : "status-badge status-inactive"
                    //   }
                    // >
                    //   {params.value}
                    // </span>
                    getStatusBadge(params.value),
                },
                {
                  field: "bookCount",
                  headerName: "Books Count",
                  flex: 1,
                  renderCell: (params) => (
                    <span
                      className={`count-badge ${
                        params.value ? "has-books" : "no-books"
                      }`}
                    >
                      {params.value || 0}
                    </span>
                  ),
                },
              ]}
            />
          </div>
        }

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
