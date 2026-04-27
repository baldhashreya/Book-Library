import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import type { Book, BookFormData, BookStatusEnum } from "../../../types/book";
import type { SearchParams } from "../../../types/role";
import type { Category } from "../../../types/category";
import type { Author } from "../../../types/author";
import { Grid, TextField, MenuItem } from "@mui/material";
import ModalHeader from "../../../shared/components/ModalHeader";
import "./BookModal.css";
import "../../../shared/styles/model.css";
import { categoryService } from "../../category/categoryService";
import { authorService } from "../../author/authorService";
import FormAction from "../../../shared/components/FormAction";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookData: BookFormData) => void;
  book?: Book | null;
  mode: "add" | "edit";
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    
    .required("title is not allowed to be empty")
    .min(3, "title must be at least 3 characters")
    .max(50, "title exceeds max length")
    .matches(/^[\x20-\x7E]*$/, "Only ASCII characters are allowed")
    .matches(/^[^<>{}$"';]*$/, "Invalid input detected")
    .test("no-double-dash", "Invalid input detected", (val) => !val || !val.includes("--")),
  author: Yup.string()
    .required("Author is required")
    .matches(/^[^<>{}$"';]*$/, "Invalid input detected")
    .test("no-double-dash", "Invalid input detected", (val) => !val || !val.includes("--")),
  category: Yup.string()
    .required("Category is required")
    .matches(/^[^<>{}$"';]*$/, "Invalid input detected")
    .test("no-double-dash", "Invalid input detected", (val) => !val || !val.includes("--")),
  status: Yup.string().required("Status is required"),
  isbn: Yup.string()
    .required("ISBN is required")
    .matches(/^\d{13}$/, "ISBN format invalid"),
  publisher: Yup.string()
    .nullable()
    .test("no-injection", "Invalid input detected", (val) => !val || !(/[{}""$]|--|;|[<>]/.test(val)))
    .test("is-year", "Publisher year must be between 1000 and 2025", (val) => {
      if (!val) return true;
      const num = Number(val);
      return !isNaN(num) && num >= 1000 && num <= 2025;
    }),
  quantity: Yup.string()
    .required("Quantity is required")
    .test("no-injection", "Invalid input detected", (val) => !val || !(/[{}""$]|--|;|[<>]/.test(val)))
    .test("is-integer", "quantity must be an integer", (val) => {
      if (!val) return true;
      // Block scientific notation and decimals
      if (/[eE.]/.test(val)) return false; 
      const num = Number(val);
      return Number.isInteger(num);
    })
    .test("is-positive", "quantity must be at least 1", (val) => {
      if (!val) return true;
      const num = Number(val);
      return num >= 1;
    }),
  description: Yup.string()
    .trim()
    .required("Description is required")
    .matches(/^[\x20-\x7E]*$/, "Only ASCII characters are allowed")
    .matches(/^[^<>{}$"';]*$/, "Invalid input detected")
    .test("no-double-dash", "Invalid input detected", (val) => !val || !val.includes("--")),
  coverImage: Yup.string()
    .nullable()
    .matches(/^[\x20-\x7E]*$/, "Only ASCII characters are allowed")
    .matches(/^[^<>{}$"';]*$/, "Invalid input detected")
    .test("no-double-dash", "Invalid input detected", (val) => !val || !val.includes("--")),
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
      status: "AVAILABLE" as BookStatusEnum,
      isbn: "",
      publisher: "" as number | "",
      quantity: 1,
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { status, publisher, quantity, ...otherValues } = values;
        const payload: BookFormData = {
          ...otherValues,
          quantity: quantity ? Number(quantity) : 0,
          publisher: publisher === "" ? undefined : Number(publisher),
          ...(mode === "edit" ? { status: status as BookStatusEnum } : {}),
        };
        await onSave(payload);
        onClose();
      } catch (error: any) {
        console.error("Error saving book:", error);
        // The apiService interceptor maps error responses to Error objects with message = errorData.message
        const errorMsg = error.message || "Error saving book";
        toast.error(errorMsg);
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
          status: "AVAILABLE" as BookStatusEnum,
          isbn: "",
          publisher: "",
          description: "",
          quantity: 1,
        });
        formik.setTouched({});
        formik.setErrors({});
      }
    }
  }, [isOpen]);

  const loadCategories = async () => {
    const cats = await categoryService.searchCategories({
      limit: 100,
      offset: 0,
    } as SearchParams);
    setCategories(cats.rows);
  };

  const loadAuthors = async () => {
    const auth = await authorService.searchAuthors({
      limit: 100,
      offset: 0,
    } as SearchParams);
    setAuthors(auth.rows);
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
          noValidate
        >
          <Grid
            container
            spacing={2}
          >
            {/* Title */}
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

            {/* Author */}
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

            {/* Category */}
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

            {/* Status */}
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
                disabled={loading || mode === "add"}
                sx={customInputStyles}
              >
                <MenuItem value="AVAILABLE" sx={{ fontSize: "14px" }}>Available</MenuItem>
                {mode === "edit" && (
                  <>
                    <MenuItem value="CHECKED_OUT" sx={{ fontSize: "14px" }}>Borrowed</MenuItem>
                    <MenuItem value="RESERVED" sx={{ fontSize: "14px" }}>Maintenance</MenuItem>
                    <MenuItem value="LOST" sx={{ fontSize: "14px" }}>Lost</MenuItem>
                  </>
                )}
              </TextField>
            </Grid>

            {/* ISBN */}
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

            {/* Published Year */}
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

            {/* Quantity */}
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

            {/* Description */}
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

          <FormAction
            onClose={onClose}
            isLoading={loading}
            onSave={formik.handleSubmit}
            label={mode === "add" ? "Add Book" : "Update Book"}
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default BookModal;
