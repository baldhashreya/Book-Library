import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  author: Yup.string().required("Author is required"),
  category: Yup.string().required("Category is required"),
  status: Yup.string().required("Status is required"),
  isbn: Yup.string(),
  publisher: Yup.number()
    .min(1000, "Publisher year must be at least 1000")
    .max(2024, "Publisher year must be at most 2024")
    .nullable()
    .transform((value, originalValue) => (String(originalValue).trim() === "" ? null : value)),
  quantity: Yup.number().min(1, "Quantity must be at least 1").required("Quantity is required"),
  description: Yup.string().nullable(),
});

const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  onSave,
  book,
  mode,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      author: "",
      category: "",
      status: "AVAILABLE",
      isbn: "",
      publisher: "" as number | "",
      quantity: 1,
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const payload: BookFormData = {
          ...values,
          publisher: values.publisher === "" ? undefined : (values.publisher as number),
        };
        await onSave(payload);
        onClose();
      } catch (error) {
        console.error("Error saving book:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      loadAuthors();
      if (mode === "edit" && book) {
        formik.setValues({
          title: book.title,
          author: typeof book.author === "object" ? book.author._id : book.author,
          category: typeof book.category === "object" ? book.category._id : book.category,
          status: book.status as any,
          isbn: book.isbn || "",
          publisher: book.publisher || "",
          quantity: book.quantity,
          description: book.description || "",
        });
      } else {
        formik.setValues({
          title: "",
          author: "",
          category: "",
          status: "AVAILABLE",
          isbn: "",
          publisher: "",
          description: "",
          quantity: 1,
        });
        formik.setTouched({});
        formik.setErrors({});
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
          onSubmit={formik.handleSubmit}
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
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
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
                value={formik.values.author}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.author && Boolean(formik.errors.author)}
                helperText={formik.touched.author && formik.errors.author}
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
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
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
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
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
                value={formik.values.isbn}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.isbn && Boolean(formik.errors.isbn)}
                helperText={formik.touched.isbn && formik.errors.isbn}
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
                value={formik.values.publisher}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.publisher && Boolean(formik.errors.publisher)}
                helperText={formik.touched.publisher && formik.errors.publisher}
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
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                helperText={formik.touched.quantity && formik.errors.quantity}
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
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
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
              type="submit"
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
