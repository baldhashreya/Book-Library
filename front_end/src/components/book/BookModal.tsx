import React, { useState, useEffect } from "react";
import type { Book, BookFormData } from "../../types/book";
import "./BookModal.css";
import type { SearchParams } from "../../types/role";
import { categoryService } from "../../services/categoryService";
import type { Category } from "../../types/category";
import { authorService } from "../../services/authorService";
import type { Author } from "../../types/author";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookData: BookFormData) => void;
  book?: Book | null;
  mode: "add" | "edit";
}

const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  onSave,
  book,
  mode,
}) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    category: "",
    status: "AVAILABLE",
    isbn: "",
    publisher: undefined,
    quantity: 1,
    description: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      loadAuthors();
      if (mode === "edit" && book) {
        setFormData({
          title: book.title,
          author:
            typeof book.author === "object" ? book.author._id : book.author,
          category:
            typeof book.category === "object"
              ? book.category._id
              : book.category,
          status: book.status,
          isbn: book.isbn || "",
          publisher: book.publisher,
          quantity: book.quantity,
          description: book.description || "",
        });
      } else {
        setFormData({
          title: "",
          author: "",
          category: "",
          status: "AVAILABLE",
          isbn: "",
          publisher: undefined,
          description: "",
          quantity: 1,
        });
      }
    }
  }, [isOpen, mode, book]);

  const loadCategories = async () => {
    try {
      const cats = await categoryService.searchCategories({} as SearchParams);
      setCategories(cats.rows);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadAuthors = async () => {
    try {
      const authorData = await authorService.searchAuthors({} as SearchParams);
      setAuthors(authorData.rows);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? parseInt(value) : undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving book:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{mode === "add" ? "Add New Book" : "Edit Book"}</h2>
          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="book-form"
        >
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Book Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Author *</label>
              <select
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option
                  value=""
                  disabled
                  hidden
                >
                  -- Select Author --
                </option>
                {authors.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option
                  value=""
                  disabled
                  hidden
                >
                  -- Select Category --
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
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
                <option value="AVAILABLE">Available</option>
                <option value="CHECKED_OUT">Borrowed</option>
                <option value="RESERVED">Maintenance</option>
                <option value="LOST">Lost</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="isbn">ISBN</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                disabled={loading}
                placeholder="Optional"
              />
            </div>

            <div className="form-group">
              <label htmlFor="publisher">Published Year</label>
              <input
                type="number"
                id="publisher"
                name="publisher"
                value={formData.publisher || ""}
                onChange={handleNumberChange}
                disabled={loading}
                min="1000"
                max="2024"
                placeholder="Optional"
              />
            </div>

            <div className="form-group">
              <label htmlFor="Quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity || 1}
                onChange={handleNumberChange}
                disabled={loading}
                min="1"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              rows={4}
              placeholder="Optional book description"
            />
          </div>

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
                ? "Add Book"
                : "Update Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;
