import React, { useState, useEffect, useCallback, useMemo } from "react";
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

  const loadCategories = useCallback(async () => {
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
  }, [paginationModel.page, paginationModel.pageSize]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleAddCategory = useCallback(() => {
    setModalMode("add");
    setSelectedCategory(null);
    setIsModalOpen(true);
  }, []);

  const handleEditCategory = useCallback((category: Category) => {
    setModalMode("edit");
    setSelectedCategory(category);
    setIsModalOpen(true);
  }, []);

  const handleDeleteCategory = useCallback(async () => {
    if (!selectedRow || selectedRow.length === 0) return;
    const categoryId = selectedRow[0];
    const category = categories.find((cat) => cat._id === categoryId);
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
        `Are you sure you want to delete the category "${category.name}"?`,
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
  }, [categories, selectedRow, loadCategories]);

  const handleSaveCategory = useCallback(async (categoryData: CategoryFormData) => {
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
  }, [modalMode, selectedCategory]);

  const getStatusBadge = useCallback((status: string) => {
    const statusConfig = {
      ACTIVE: { class: "status-active", text: "Active" },
      IN_ACTIVE: { class: "status-inactive", text: "In active" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.ACTIVE;
    return (
      <span className={`status-badge ${config.class}`}>{config.text}</span>
    );
  }, []);

  const columns = useMemo(() => [
    {
      field: "name",
      headerName: "Category Name",
      flex: 1,
      valueGetter: (_value: any, row: any) => row.name || "",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      valueGetter: (_value: any, row: any) => row.description || "",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params: any) => getStatusBadge(params.value),
    },
    {
      field: "bookCount",
      headerName: "Books Count",
      flex: 1,
      renderCell: (params: any) => (
        <span
          className={`count-badge ${
            params.value ? "has-books" : "no-books"
          }`}
        >
          {params.value || 0}
        </span>
      ),
    },
  ], [getStatusBadge]);

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
              onDelete={useCallback((row: any) => {
                setSelectedRow([row._id]);
                handleDeleteCategory();
              }, [handleDeleteCategory])}
              columns={columns}
            />
          </div>
        }

        <CategoryModal
          isOpen={isModalOpen}
          onClose={useCallback(() => setIsModalOpen(false), [])}
          onSave={handleSaveCategory}
          category={selectedCategory}
          mode={modalMode}
        />
      </div>
    </MainLayout>
  );
};

export default CategoryPage;
