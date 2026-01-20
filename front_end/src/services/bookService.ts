import type { BookFormData } from "../types/book";
import type { SearchParams } from "../types/role";
import { apiService } from "./api";

export const bookService = {
  // Get all books
  async searchBooks(params: SearchParams) {
    try {
      const result = await apiService.post("/books/search", params);
      return result.data || [];
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },

  // Create new book
  async createBook(bookData: BookFormData): Promise<void> {
    try {
      await apiService.post("/books", bookData);
    } catch (error) {
      console.error("Error creating book:", error);
      throw error;
    }
  },

  // Update book
  async updateBook(id: string, bookData: BookFormData): Promise<void> {
    try {
      await apiService.put(`/books/${id}`, bookData);
    } catch (error) {
      console.error("Error updating book:", error);
      throw error;
    }
  },

  // Delete book
  async deleteBook(id: string): Promise<void> {
    try {
      await apiService.delete(`/books/${id}`);
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error;
    }
  },

  async assignBook(bookId: string, params: any): Promise<void> {
    try {
      const data = await apiService.post(
        `/books/${bookId}/assign-book`,
        params,
      );
      return data.categories || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
};
