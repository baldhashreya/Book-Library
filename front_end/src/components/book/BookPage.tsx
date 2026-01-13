import React, { useState, useEffect } from "react";
import MainLayout from "../MainLayout";
import BookModal from "./BookModal";
import type { Book, BookFormData } from "../../types/book";
import { bookService } from "../../services/bookService";
import "./BookPage.css";
import type { SearchParams } from "../../types/role";
import AssignBookModal from "./AssignBookModal";
import CustomButton from "../common/Button/CustomButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const BookPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignBook, setAssignBook] = useState<Book | null>(null);

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

  const handleAssignBook = (book: Book) => {
    console.log(book);
    setAssignBook(book);
    setIsAssignModalOpen(true);
  };

  const saveAssignedBook = async (param: {
    userId: string;
    returnDate: Date;
  }) => {
    if (!assignBook) return;

    try {
      await bookService.assignBook(assignBook._id, param);

      const updatedBooks = await bookService.searchBooks({
        limit: 100,
        offset: 0,
      });
      setBooks(updatedBooks);

      setIsAssignModalOpen(false);
      setAssignBook(null);
    } catch (err) {
      console.error("Error assigning book:", err);
      alert("Failed to assign book");
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

  const toggleSelectRow = (id: string) => {
    setSelectedRow((prev) => (prev === id ? null : id));
  };

  const filteredBooks = books;

  return (
    <MainLayout>
      <div className="book-page">
        <div className="page-header">
          <div className="toolbar">
            <CustomButton
              className="add-book-btn"
              onClick={handleAddBook}
              label="Add New Book"
              variant="contained"
              startIcon={<AddIcon />}
            ></CustomButton>

            <CustomButton
              className="delete-selected-btn"
              onClick={() => {
                if (selectedRow) {
                  handleDeleteBook(selectedRow);
                }
              }}
              label="Delete Book"
              variant="contained"
              startIcon={<DeleteIcon />}
              disabled={!selectedRow}
            />
            <button
              className="edit-selected-btn"
              disabled={!selectedRow}
              onClick={() => {
                const bookToEdit = books.find((b) => b._id === selectedRow);
                if (bookToEdit) handleEditBook(bookToEdit);
              }}
            >
              Edit Book1
            </button>
            <CustomButton
              className="edit-selected-btn"
              onClick={() => {
                const bookToEdit = books.find((b) => b._id === selectedRow);
                if (bookToEdit) handleEditBook(bookToEdit);
              }}
              label="Edit Book"
              variant="contained"
              disabled={!selectedRow}
            ></CustomButton>
            <button
              className="assign-selected-btn"
              disabled={!selectedRow}
              onClick={() => {
                const bookToAssign = books.find((b) => b._id === selectedRow);
                console.log(bookToAssign);
                if (bookToAssign) handleAssignBook(bookToAssign);
              }}
            >
              Assign Book
            </button>
            <CustomButton
              className="assign-selected-btn"
              onClick={() => {
                const bookToAssign = books.find((b) => b._id === selectedRow);
                console.log(bookToAssign);
                if (bookToAssign) handleAssignBook(bookToAssign);
              }}
              label="Assign Book"
              variant="contained"
              disabled={!selectedRow}
            ></CustomButton>
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
                <h3>No books found</h3>
                <p>
                  Your library is empty. Add your first book to get started.
                </p>
              </div>
            ) : (
              <table className="books-table">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Book Name</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Available Book</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book._id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRow === book._id}
                          onChange={() => toggleSelectRow(book._id)}
                        />
                      </td>
                      <td>
                        <div className="book-title">
                          <strong>{book.title}</strong>
                          {book.publisher && (
                            <span className="book-year">
                              ({book.publisher})
                            </span>
                          )}
                        </div>
                      </td>
                      <td>{book.author.name}</td>
                      <td>
                        <span className="category-tag">
                          {book.category.name}
                        </span>
                      </td>
                      <td>{book.quantity - (book.issuedBook || 0)}</td>
                      <td>{getStatusBadge(book.status)}</td>
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

        <AssignBookModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          onSave={saveAssignedBook}
          book={assignBook}
        />
      </div>
    </MainLayout>
  );
};

export default BookPage;
