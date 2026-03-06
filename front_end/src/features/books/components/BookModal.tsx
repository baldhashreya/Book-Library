import React, { useState, useEffect } from "react";
import type { Book, BookFormData } from "../../../types/book";
import "./BookModal.css";
import type { SearchParams } from "../../../types/role";
import { categoryService } from "../../category/categoryService";
import type { Category } from "../../../types/category";
import { authorService } from "../../author/authorService";
import type { Author } from "../../../types/author";
import CustomButton from "../../../shared/components/Button/CustomButton";
import { Grid, TextField, MenuItem } from "@mui/material";
import ModalHeader from "../../../shared/components/ModalHeader";

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
            typeof book.category === "object" ?
              book.category._id
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
      const cats = await categoryService.searchCategories({
        limit: 100,
        offset: 0,
      } as SearchParams);
      setCategories(cats.rows);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadAuthors = async () => {
    try {
      const authorData = await authorService.searchAuthors({
        limit: 100,
        offset: 0,
      } as SearchParams);
      setAuthors(authorData.rows);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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

  const customInputStyles = {
    "& .MuiInputBase-root": {
      fontSize: "14px", // input font size here
    },
    "& .MuiInputLabel-root": {
      fontSize: "14px", // label font size here
    },
    "& .MuiOutlinedInput-root": {
      "& input": {
        padding: "10px 14px", //padding and height here
      },
    },
    "& .MuiSelect-select": {
      padding: "10px 14px !important", // Changes padding/height for <select> inputs
    },
    "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
      transform: "translate(14px, 10px) scale(1)", // Adjust this if you change the padding
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <ModalHeader
          title={mode === "add" ? "Add Book" : "Edit Book"}
          onClose={onClose}
        />

        <form
          onSubmit={handleSubmit}
          className="book-form"
        >
          <Grid
            container
            spacing={2}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Book Title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
                variant="outlined"
                sx={customInputStyles}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                id="author"
                name="author"
                label="Author"
                value={formData.author}
                onChange={handleChange}
                required
                disabled={loading}
                sx={customInputStyles}
              >
                <MenuItem value="" disabled sx={{ fontSize: "14px" }}>
                  <em>-- Select Author --</em>
                </MenuItem>
                {authors.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id} sx={{ fontSize: "14px" }}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                id="category"
                name="category"
                label="Category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={loading}
                sx={customInputStyles}
              >
                <MenuItem value="" disabled sx={{ fontSize: "14px" }}>
                  <em>-- Select Category --</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id} sx={{ fontSize: "14px" }}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                id="status"
                name="status"
                label="Status"
                value={formData.status}
                onChange={handleChange}
                required
                disabled={loading}
                sx={customInputStyles}
              >
                <MenuItem value="AVAILABLE" sx={{ fontSize: "14px" }}>Available</MenuItem>
                <MenuItem value="CHECKED_OUT" sx={{ fontSize: "14px" }}>Borrowed</MenuItem>
                <MenuItem value="RESERVED" sx={{ fontSize: "14px" }}>Maintenance</MenuItem>
                <MenuItem value="LOST" sx={{ fontSize: "14px" }}>Lost</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                id="isbn"
                name="isbn"
                label="ISBN"
                value={formData.isbn}
                onChange={handleChange}
                disabled={loading}
                placeholder="Optional"
                sx={customInputStyles}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                id="publisher"
                name="publisher"
                label="Published Year"
                value={formData.publisher || ""}
                onChange={handleNumberChange}
                disabled={loading}
                slotProps={{ htmlInput: { min: 1000, max: 2024 } }}
                placeholder="Optional"
                sx={customInputStyles}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                id="quantity"
                name="quantity"
                label="Quantity"
                value={formData.quantity || 1}
                onChange={handleNumberChange}
                disabled={loading}
                slotProps={{ htmlInput: { min: 1 } }}
                sx={customInputStyles}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                id="description"
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                placeholder="Optional book description"
                sx={{
                  "& .MuiInputBase-root": {
                    fontSize: "14px",
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "14px",
                  }
                }}
              />
            </Grid>
          </Grid>

          <div className="form-actions">
            <CustomButton
              variant="contained"
              onClick={onClose}
              label="Cancel"
              className="cancel-btn"
              disabled={loading}
            />
            <CustomButton
              variant="contained"
              onClick={handleSubmit}
              label={
                loading ? "Saving..."
                : mode === "add" ?
                  "Add Book"
                : "Update Book"
              }
              className="save-btn"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;
