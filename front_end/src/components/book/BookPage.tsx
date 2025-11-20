import React, { useState, useEffect } from "react";
import MainLayout from "../MainLayout";
import BookModal from "./BookModal";
import type { Book, BookFormData } from "../../types/book";
import { PencilLine, Trash } from "lucide-react";
import { bookService } from "../../services/bookService";
import "./BookPage.css";
import type { SearchParams } from "../../types/role";

const BookPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    loadBooks({ limit: 100, offset: 0 });
  }, []);

  const loadBooks = async (params: SearchParams) => {
    try {
      setLoading(true);
      const booksData = await bookService.searchBooks(params);
      setBooks(booksData);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = () => {
    setModalMode("add");
    setSelectedBook(null);
    setIsModalOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setModalMode("edit");
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleDeleteBook = async (bookId: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookService.deleteBook(bookId);
        const updatedBooks = await bookService.searchBooks({
          limit: 100,
          offset: 0,
        });
        setBooks(updatedBooks);
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Error deleting book. Please try again.");
      }
    }
  };

  const handleSaveBook = async (bookData: BookFormData) => {
    try {
      if (modalMode === "add") {
        await bookService.createBook(bookData);
      } else if (modalMode === "edit" && selectedBook) {
        await bookService.updateBook(selectedBook._id, bookData);
      }

      const updatedBooks = await bookService.searchBooks({
        limit: 100,
        offset: 0,
      });
      setBooks(updatedBooks);
      setIsModalOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error("Error saving book:", error);
      throw error;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { class: "status-available", text: "Available" },
      borrowed: { class: "status-borrowed", text: "Borrowed" },
      maintenance: { class: "status-maintenance", text: "Maintenance" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.available;
    return (
      <span className={`status-badge ${config.class}`}>{config.text}</span>
    );
  };

  const filteredBooks = books;

  return (
    <MainLayout>
      <div className="book-page">
        <div className="page-header">
          <button
            className="add-book-btn"
            onClick={handleAddBook}
          >
            <span>+</span>
            Add New Book
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading books...</p>
          </div>
        ) : (
          <div className="books-table-container">
            {filteredBooks.length === 0 ? (
              <div className="empty-state">
                <h3>No books found</h3>
                <p>
                  {"Your library is empty. Add your first book to get started."}
                </p>
              </div>
            ) : (
              <table className="books-table">
                <thead>
                  <tr>
                    <th>Book Name</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book.id}>
                      <td>
                        <div className="book-title">
                          <strong>{book.title}</strong>
                          {book.publishedYear && (
                            <span className="book-year">
                              ({book.publishedYear})
                            </span>
                          )}
                        </div>
                      </td>
                      <td>{book.author.name}</td>
                      <td>
                        <span className="category-tag">{book.category.name}</span>
                      </td>
                      <td>{getStatusBadge(book.status)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn view-btn"
                            onClick={() => handleEditBook(book)}
                            title="View/Edit Book"
                          >
                            <PencilLine />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteBook(book._id)}
                            title="Delete Book"
                          >
                            <Trash />
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

        <BookModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveBook}
          book={selectedBook}
          mode={modalMode}
        />
      </div>
    </MainLayout>
  );
};

export default BookPage;
