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
import ConfirmModal from "../../../shared/components/ConfirmModal";
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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
   const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({});
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [sortModel, setSortModel] = useState<any[]>([]);

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      const booksData = await bookService.searchBooks({
        limit: paginationModel.pageSize,
        offset: paginationModel.page * paginationModel.pageSize,
        order: sortModel.length > 0 ? [[sortModel[0].field, sortModel[0].sort]] : [],
        ...filters,
      });
      console.log("Fata:::::::::::::::", booksData.rows);
      setBooks(booksData.rows);
      setTotalCount(booksData.count);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  }, [paginationModel.page, paginationModel.pageSize, filters, sortModel]);

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

  const handleDeleteBook = useCallback((id?: string) => {
    const targetId = id || (selectedRow && selectedRow[0]);
    if (!targetId) return;
    
    setBookToDelete(targetId);
    setIsConfirmModalOpen(true);
  }, [selectedRow]);

  const handleConfirmDelete = useCallback(async () => {
    if (!bookToDelete) return;

    try {
      await bookService.deleteBook(bookToDelete);
      await loadBooks();
      setIsConfirmModalOpen(false);
      setBookToDelete(null);
      
      // Clear selection if the deleted book was selected
      if (selectedRow && selectedRow[0] === bookToDelete) {
        setSelectedRow([]);
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Error deleting book. Please try again.");
    }
  }, [bookToDelete, loadBooks, selectedRow]);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmModalOpen(false);
    setBookToDelete(null);
  }, []);

  const handleAssignBook = useCallback((book: Book) => {
    console.log(book);
    setAssignBook(book);
    setIsAssignModalOpen(true);
  }, []);

  const saveAssignedBook = useCallback(async (param: {
    userId: string;
    returnDate: string;
  }) => {
    if (!assignBook) return;

    try {
      const parsedParam = { ...param, returnDate: new Date(param.returnDate) };
      await bookService.assignBook(assignBook._id, parsedParam);
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
  }, [modalMode, selectedBook, loadBooks]);

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
      valueGetter: (_value: any, row: any) => row.title || "",
    },
    {
      field: "author",
      headerName: "Author",
      flex: 1,
      valueGetter: (_value: any, row: any) => row.author.name || "",
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      valueGetter: (_value: any, row: any) => row.category.name || "",
    },
    {
      field: "bookCount",
      headerName: "Available Book",
      flex: 1,
      valueGetter: (_value: any, row: any) =>
        row.quantity - (row.issuedBook || 0),
    },
    {
      field: "status",
      headerName: "status",
      flex: 1,
      renderCell: (params: any) => getStatusBadge(params.value),
    },
  ], [getStatusBadge]);

  return (
    <MainLayout>
      <div className="page-header">
          <div className="header-right">
            <CustomButton 
              variant="outlined"
              onClick={() => setIsFilterOpen(true)}
              label="Filter"
              className="filter-button"
              disabled={loading}
              startIcon={<FilterListIcon />}
            />
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
              onClick={useCallback(() => {
                const bookToAssign = books.find((b) => selectedRow && selectedRow.length > 0 && b._id === selectedRow[0]);
                console.log(bookToAssign);
                if (bookToAssign) handleAssignBook(bookToAssign);
              }, [books, selectedRow, handleAssignBook])}
              label="Assign Book"
              variant="contained"
              disabled={!selectedRow || selectedRow.length === 0}
              startIcon={<AssignmentIcon />}
            />
          </div>
        </div>
      <div className="main-page">

        <DataTable
                rows={books}
                rowCount={totalCount}
                paginationModel={paginationModel}
                onPaginationChange={setPaginationModel}
                sortModel={sortModel}
                onSortModelChange={setSortModel}
                loading={loading}
                onEdit={handleEditBook}
                onDelete={useCallback((row: any) => {
                  handleDeleteBook(row._id);
                }, [handleDeleteBook])}
                columns={columns}
                checkboxSelection={true}
                disableMultipleRowSelection={true}
                onRowSelect={setSelectedRow}
              />

        <BookModal
          isOpen={isModalOpen}
          onClose={useCallback(() => setIsModalOpen(false), [])}
          onSave={handleSaveBook}
          book={selectedBook}
          mode={modalMode}
        />

        <AssignBookModal
          isOpen={isAssignModalOpen}
          onClose={useCallback(() => setIsAssignModalOpen(false), [])}
          onSave={saveAssignedBook}
          book={assignBook}
        />

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          title="Delete Book"
          message="Are you sure you want to delete this book? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
        <BookPageFilter
                  isFilterOpen={isFilterOpen}
                  setIsFilterOpen={setIsFilterOpen}
                  filters={filters}
                  setFilters={setFilters}
                  setPaginationModel={setPaginationModel}
                />
      </div>
    </MainLayout>
  );
};

export default BookPage;
