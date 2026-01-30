import type { Author, AuthorFormData } from "../types/author";
import type { SearchParams } from "../types/role";
import { apiService } from "./api";

export const authorService = {
  // Get all authors
  async searchAuthors(params: SearchParams) {
    try {
      const result = await apiService.post("/author/search", params);
      return result.data || [];
    } catch (error) {
      console.error("Error fetching authors:", error);
      throw error;
    }
  },

  // Get authors by ID
  async getAuthorById(id: string): Promise<Author | null> {
    try {
      const result = await apiService.get(`/author/${id}`);
      return result.data || null;
    } catch (error) {
      console.error("Error fetching author:", error);
      throw error;
    }
  },

  // Create new author
  async createAuthor(authorData: AuthorFormData): Promise<Author> {
    try {
      const data = await apiService.post("/author", authorData);
      return data.author;
    } catch (error) {
      console.error("Error creating author:", error);
      throw error;
    }
  },

  // Update author
  async updateAuthor(id: string, authorData: AuthorFormData): Promise<Author> {
    try {
      const result = await apiService.put(`/author/${id}`, authorData);
      return result.data;
    } catch (error) {
      console.error("Error updating author:", error);
      throw error;
    }
  },

  // Delete author
  async deleteAuthor(id: string): Promise<void> {
    try {
      await apiService.delete(`/author/${id}`);
    } catch (error) {
      console.error("Error deleting author:", error);
      throw error;
    }
  },
};
