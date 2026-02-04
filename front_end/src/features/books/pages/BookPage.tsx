import React, { useState, useEffect } from "react";
import MainLayout from "../../../shared/layouts/MainLayout";
import BookModal from "../components/BookModal";
import type { Book, BookFormData } from "../../../types/book";
import { bookService } from "../bookService";
import "./BookPage.css";
import "../../../shared/styles/button.css";
import AssignBookModal from "../components/AssignBookModal";
import CustomButton from "../../../shared/components/Button/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DataTable from "../../../shared/components/DataTable";

const BookPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedRow, setSelectedRow] = useState<string[] | null>([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignBook, setAssignBook] = useState<Book | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  useEffect(() => {
    loadBooks();
  }, [paginationModel]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const booksData = await bookService.searchBooks({
        limit: paginationModel.pageSize,
        offset: paginationModel.page,
      });
      setBooks(booksData.rows);
      setTotalCount(booksData.count);
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

  const handleDeleteBook = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookService.deleteBook(selectedRow[0]);
        await loadBooks();
        setIsModalOpen(false);
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
      await loadBooks();
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

      await loadBooks();
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
          <div className="toolbar">
            <CustomButton
              className="add-selected-btn btn"
              onClick={handleAddBook}
              label="Add New Book"
              variant="contained"
              startIcon={<AddIcon />}
            />

            {/* <CustomButton
              className="delete-selected-btn btn"
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
            <CustomButton
              className="edit-selected-btn btn"
              onClick={() => {
                const bookToEdit = books.find((b) => b._id === selectedRow);
                if (bookToEdit) handleEditBook(bookToEdit);
              }}
              label="Edit Book"
              variant="contained"
              disabled={!selectedRow}
              startIcon={<EditIcon />}
            /> */}
            <CustomButton
              className="assign-selected-btn btn"
              onClick={() => {
                const bookToAssign = books.find((b) => b._id === selectedRow);
                console.log(bookToAssign);
                if (bookToAssign) handleAssignBook(bookToAssign);
              }}
              label="Assign Book"
              variant="contained"
              disabled={!selectedRow}
              startIcon={<AssignmentIcon />}
            />
          </div>
        </div>

        {loading ?
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading books...</p>
          </div>
        : <div className="books-table-container">
            {filteredBooks.length === 0 ?
              <div className="empty-state">
                <h3>No books found</h3>
                <p>
                  Your library is empty. Add your first book to get started.
                </p>
              </div>
            : <DataTable
                rows={filteredBooks}
                rowCount={totalCount}
                paginationModel={paginationModel}
                onPaginationChange={setPaginationModel}
                loading={loading}
                onEdit={handleEditBook}
                onDelete={(row) => {
                  setSelectedRow([row._id]);
                  handleDeleteBook();
                }}
                columns={[
                  {
                    field: "name",
                    headerName: "Book Name",
                    flex: 1,
                    valueGetter: (_value, row) => row.title || "",
                  },
                  {
                    field: "author",
                    headerName: "Author",
                    flex: 1,
                    valueGetter: (_value, row) => row.author.name || "",
                  },
                  {
                    field: "category",
                    headerName: "Category",
                    flex: 1,
                    valueGetter: (_value, row) => row.category.name || "",
                  },
                  {
                    field: "bookCount",
                    headerName: "Available Book",
                    flex: 1,
                    valueGetter: (_value, row) =>
                      row.quantity - (row.issuedBook || 0),
                  },
                  {
                    field: "status",
                    headerName: "status",
                    flex: 1,
                    renderCell: (params) => getStatusBadge(params.value),
                  },
                ]}
                checkboxSelection={true}
                disableMultipleRowSelection={true}
                onRowSelect={setSelectedRow}
              />
            }
          </div>
        }

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
