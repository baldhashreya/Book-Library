import React, { useState, useEffect } from "react";
import MainLayout from "../MainLayout";
import BookModal from "./BookModal";
import type { Book, BookFormData } from "../../types/Book";
import { bookService } from "../../services/bookService";
import "./BookPage.css";

const BookPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const booksData = await bookService.getBooks();
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
        setBooks((prev) => prev.filter((book) => book.id !== bookId));
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Error deleting book. Please try again.");
      }
    }
  };

  const handleSaveBook = async (bookData: BookFormData) => {
    try {
      if (modalMode === "add") {
        const newBook = await bookService.addBook(bookData);
        setBooks((prev) => [...prev, newBook]);
      } else if (modalMode === "edit" && selectedBook) {
        const updatedBook = await bookService.updateBook(
          selectedBook.id,
          bookData
        );
        if (updatedBook) {
          setBooks((prev) =>
            prev.map((book) =>
              book.id === selectedBook.id ? updatedBook : book
            )
          );
        }
      }
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

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="book-page">
        <div className="page-header">
          <div className="header-content">
            <h1>Book Management</h1>
            <p>Manage your library's book collection</p>
          </div>
          <button
            className="add-book-btn"
            onClick={handleAddBook}
          >
            <span>+</span>
            Add New Book
          </button>
        </div>

        <div className="book-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search books by title, author, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="book-stats">
            <span>Total Books: {books.length}</span>
            <span>
              Available: {books.filter((b) => b.status === "available").length}
            </span>
          </div>
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
                <div className="empty-icon">📚</div>
                <h3>No books found</h3>
                <p>
                  {searchTerm
                    ? "No books match your search criteria. Try adjusting your search."
                    : "Your library is empty. Add your first book to get started."}
                </p>
                {!searchTerm && (
                  <button
                    className="add-book-btn"
                    onClick={handleAddBook}
                  >
                    Add Your First Book
                  </button>
                )}
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
                      <td>{book.author}</td>
                      <td>
                        <span className="category-tag">{book.category}</span>
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
                            onClick={() => handleDeleteBook(book.id)}
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
