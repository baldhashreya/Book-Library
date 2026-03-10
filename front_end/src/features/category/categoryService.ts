import type { Category, CategoryFormData, CategorySearchParams } from "../../types/category";
import { apiService } from "../../services/api";

export const categoryService = {
  // Get all categories
  async searchCategories(params: CategorySearchParams) {
    try {
      const result = await apiService.post("/categories/search", params);
      return result.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get category by ID
  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const result = await apiService.get(`/categories/${id}`);
      return result.data || null;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  },

  // Create new category
  async createCategory(categoryData: CategoryFormData): Promise<Category> {
    try {
      const data = await apiService.post("/categories", categoryData);
      return data.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // Update category
  async updateCategory(
    id: string,
    categoryData: CategoryFormData,
  ): Promise<Category> {
    try {
      const data = await apiService.put(`/categories/${id}`, categoryData);
      return data.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    try {
      await apiService.delete(`/categories/${id}`);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },
};
