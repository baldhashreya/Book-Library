import type { Book, BookFormData } from '../types/book';
import type { SearchParams } from '../types/role';
import { apiService } from './api';

export const bookService = {
  // Get all books
  async searchBooks(params: SearchParams): Promise<Book[]> {
    try {
      const result = await apiService.post('/books/search', params);
      return result.data || [];
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },

  // Get book by ID
  async getBookById(id: string): Promise<Book | null> {
    try {
      const data = await apiService.get(`/books/${id}`);
      return data.book || null;
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  },

  // Create new book
  async createBook(bookData: BookFormData): Promise<Book> {
    try {
      const data = await apiService.post('/books', bookData);
      return data.book;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  },

  // Update book
  async updateBook(id: string, bookData: BookFormData): Promise<Book> {
    try {
      const data = await apiService.put(`/books/${id}`, bookData);
      return data.book;
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  },

  // Delete book
  async deleteBook(id: string): Promise<void> {
    try {
      await apiService.delete(`/books/${id}`);
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  },

  // Get categories
  async getCategories(): Promise<string[]> {
    try {
      const data = await apiService.get('/books/categories');
      return data.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
};