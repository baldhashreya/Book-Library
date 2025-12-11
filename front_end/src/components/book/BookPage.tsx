import React, { useState, useEffect } from "react";
import MainLayout from "../MainLayout";
import { ArrowDown, ArrowUp } from "lucide-react";
import BookModal from "./BookModal";
import type { Book, BookFormData } from "../../types/book";
import { bookService } from "../../services/bookService";
import "./BookPage.css";
import type { SearchParams } from "../../types/role";
import AssignBookModal from "./AssignBookModal";

const BookPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignBook, setAssignBook] = useState<Book | null>(null);

  // PAGINATION STATE
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // SORTING STATE
  const [orderBy, setOrderBy] = useState<
    "title" | "author" | "category" | "status" | "available_bok"
  >("title");
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");

  // Load books whenever page, limit, sorting changes
  useEffect(() => {
    loadBooks();
  }, [page, limit, orderBy, order]);

  // Backend call
  const loadBooks = async () => {
    try {
      setLoading(true);

      const offset = (page - 1) * limit;

      const params: SearchParams = {
        limit,
        offset,
        order: [[orderBy, order]],
      };

      const response = await bookService.searchBooks(params);

      setBooks(response.rows);
      setTotalCount(response.count);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  // ADD BOOK
  const handleAddBook = () => {
    setModalMode("add");
    setSelectedBook(null);
    setIsModalOpen(true);
  };

  // EDIT BOOK
  const handleEditBook = (book: Book) => {
    setModalMode("edit");
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  // DELETE BOOK
  const handleDeleteBook = async (bookId: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookService.deleteBook(bookId);
        loadBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  // ASSIGN BOOK
  const handleAssignBook = (book: Book) => {
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
      loadBooks();
      setIsAssignModalOpen(false);
      setAssignBook(null);
    } catch (err) {
      console.error("Error assigning book:", err);
      alert("Failed to assign book");
    }
  };

  // SAVE BOOK
  const handleSaveBook = async (bookData: BookFormData) => {
    try {
      if (modalMode === "add") {
        await bookService.createBook(bookData);
      } else if (modalMode === "edit" && selectedBook) {
        await bookService.updateBook(selectedBook._id, bookData);
      }

      loadBooks();
      setIsModalOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  // STATUS BADGE
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

  const getSortArrow = (column: string) => {
    if (orderBy !== column) return "";

    return order === "ASC" ? (
      <ArrowUp
        size={16}
        strokeWidth={2}
      />
    ) : (
      <ArrowDown
        size={16}
        strokeWidth={2}
      />
    );
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRow((prev) => (prev === id ? null : id));
  };

  const totalPages = Math.ceil(totalCount / limit);
  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleSort = (column: typeof orderBy) => {
    if (orderBy === column) {
      setOrder(order === "ASC" ? "DESC" : "ASC");
    } else {
      setOrderBy(column);
      setOrder("ASC");
    }
  };

  return (
    <MainLayout>
      <div className="book-page">
        <div className="page-title-bar">
          <h2>Book Management</h2>

          <div className="title-actions">
            <button className="primary-btn">Add</button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <button className="toolbar-btn">Filter</button>
          <button className="toolbar-btn">Group</button>
          <button className="toolbar-btn">Update</button>
          <button className="toolbar-btn">Refresh</button>

          <div className="toolbar-search">
            <input
              type="text"
              placeholder="Search…"
            />
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading books...</p>
          </div>
        ) : (
          <div className="table-card">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th onClick={() => handleSort("title")}>
                    Book Name{" "}
                    <span className="sort-arrow">{getSortArrow("title")}</span>
                  </th>
                  <th onClick={() => handleSort("author")}>
                    Author{" "}
                    <span className="sort-arrow">{getSortArrow("author")}</span>
                  </th>
                  <th onClick={() => handleSort("category")}>
                    Category{" "}
                    <span className="sort-arrow">
                      {getSortArrow("category")}
                    </span>
                  </th>
                  <th
                  // onClick={() => handleSort("available_bok")}
                  >
                    Available Book{" "}
                    {/* <span className="sort-arrow">
                      {getSortArrow("available_bok")}
                    </span> */}
                  </th>
                  <th onClick={() => handleSort("status")}>
                    Status{" "}
                    <span className="sort-arrow">{getSortArrow("status")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRow === book._id}
                        onChange={() => toggleSelectRow(book._id)}
                      />
                    </td>

                    <td>{book.title}</td>
                    <td>{book.author}</td>

                    <td>
                      <span className="category-tag">{book.category}</span>
                    </td>

                    <td>{book.quantity - (book.issuedBook || 0)}</td>

                    <td>{getStatusBadge(book.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={prevPage}
              >
                Previous
              </button>

              <span className="page-info">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={nextPage}
              >
                Next
              </button>

              <select
                className="limit-select"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        )}

        {/* MODALS */}
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
