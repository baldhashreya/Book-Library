import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import FilterListIcon from "@mui/icons-material/FilterList";
import BookPageFilter from "../components/BookPageFilter";

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
   const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({});
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      const booksData = await bookService.searchBooks({
        limit: paginationModel.pageSize,
        offset: paginationModel.page * paginationModel.pageSize,
        ...filters,
      });
      setBooks(booksData.rows);
      setTotalCount(booksData.count);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, paginationModel]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleAddBook = useCallback(() => {
    setModalMode("add");
    setSelectedBook(null);
    setIsModalOpen(true);
  }, []);

  const handleEditBook = useCallback((book: Book) => {
    setModalMode("edit");
    setSelectedBook(book);
    setIsModalOpen(true);
  }, []);

  const handleDeleteBook = useCallback(async (bookId: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookService.deleteBook(bookId);
        await loadBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Error deleting book. Please try again.");
      }
    }
  }, [loadBooks]);

  const handleAssignBook = useCallback((book: Book) => {
    console.log(book);
    setAssignBook(book);
    setIsAssignModalOpen(true);
  }, []);

  const saveAssignedBook = useCallback(async (param: {
    userId: string;
    returnDate: Date;
  }) => {
    if (!assignBook) return;

    try {
      await bookService.assignBook(assignBook._id, param as any);
      await loadBooks();
      setIsAssignModalOpen(false);
      setAssignBook(null);
    } catch (err) {
      console.error("Error assigning book:", err);
      alert("Failed to assign book");
    }
  }, [assignBook, loadBooks]);

  const handleSaveBook = useCallback(async (bookData: BookFormData) => {
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
  }, [loadBooks, modalMode, selectedBook]);

  const getStatusBadge = useCallback((status: string) => {
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
  }, []);

  const columns = useMemo(() => [
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
  ], [getStatusBadge]);

  const handleRowSelection = useCallback((ids: string[] | null) => {
    setSelectedRow(ids);
  }, []);

  return (
    <MainLayout>
      <div className="page-header">
          <div className="header-right">
            <CustomButton 
              variant="outlined"
              onClick={handleAddBook}
              label="Add Book"
              className="add-button"
              disabled={loading}
              startIcon={<AddIcon />}
            />

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

            <CustomButton 
              variant="outlined"
              onClick={() => setIsFilterOpen(true)}
              label="Filter"
              className="filter-button"
              disabled={loading}
              startIcon={<FilterListIcon />}
            />
            
          </div>
        </div>
      <div className="main-page">

        <DataTable
                rows={books}
                rowCount={totalCount}
                paginationModel={paginationModel}
                onPaginationChange={setPaginationModel}
                loading={loading}
                onEdit={handleEditBook}
                onDelete={(row) => {
                  handleDeleteBook(row._id);
                }}
                columns={columns}
                checkboxSelection={true}
                disableMultipleRowSelection={true}
                onRowSelect={handleRowSelection}
              />

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

        <BookPageFilter
                  isFilterOpen={isFilterOpen}
                  setIsFilterOpen={setIsFilterOpen}
                  filters={filters}
                  setFilters={setFilters}
                  setPaginationModel={setPaginationModel}
                  loadBooks={loadBooks}
                />
      </div>
    </MainLayout>
  );
};

export default BookPage;
