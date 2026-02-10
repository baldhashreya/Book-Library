import React, { useEffect, useState } from "react";
import type { Book, BookFormData } from "../../../types/book";
import type { SearchParams } from "../../../types/role";
import type { Category } from "../../../types/category";
import type { Author } from "../../../types/author";

import "./BookModal.css";
import "../../../shared/styles/model.css";

import { Grid } from "@mui/material";
import { useFormik } from "formik";

import { categoryService } from "../../category/categoryService";
import { authorService } from "../../author/authorService";
import ModelHeader from "../../../shared/components/FormHeader";
import AppTextField from "../../../shared/components/AppTextField";
import { bookSchema } from "./book.model";
import FormAction from "../../../shared/components/FormAction";

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
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  /* -------- Load dropdown data -------- */
  useEffect(() => {
    if (isOpen) {
      loadCategories();
      loadAuthors();
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

  /* -------- Initial Values -------- */
  const initialValues: BookFormData =
    mode === "edit" && book ?
      {
        title: book.title,
        author: typeof book.author === "object" ? book.author._id : book.author,
        category:
          typeof book.category === "object" ? book.category._id : book.category,
        status: book.status,
        isbn: book.isbn || "",
        publisher: book.publisher || undefined,
        quantity: book.quantity || 1,
        description: book.description || "",
      }
    : {
        title: "",
        author: "",
        category: "",
        status: "AVAILABLE",
        isbn: "",
        publisher: undefined,
        quantity: 1,
        description: "",
      };

  /* ---------------- Formik ---------------- */
  const formik = useFormik({
    initialValues,
    validationSchema: bookSchema,
    enableReinitialize: true,
    onSubmit: async (values, actions) => {
      try {
        setLoading(true);
        await onSave(values);
        actions.resetForm();
        onClose();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        actions.setSubmitting(false);
      }
    },
  });

  const fieldProps = (name: keyof typeof formik.values) => ({
    name,
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched[name] && Boolean(formik.errors[name]),
    helperText: formik.touched[name] && formik.errors[name],
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <ModelHeader
          header={mode === "add" ? "Add New Book" : "Edit Book"}
          onClose={onClose}
          loading={loading}
        />

        <form
          onSubmit={formik.handleSubmit}
          className="book-form"
        >
          <Grid
            container
            spacing={2}
          >
            {/* Title */}
            <Grid size={{ xs: 12, md: 6 }}>
              <AppTextField
                label="Book Title"
                {...fieldProps("title")}
                fullWidth
              />
            </Grid>

            {/* Author */}
            <Grid size={{ xs: 12, md: 6 }}>
              <AppTextField
                label="Author"
                select
                fullWidth
                {...fieldProps("author")}
              >
                <option
                  value=""
                  disabled
                  hidden
                >
                  -- Select Author --
                </option>
                {authors.map((a) => (
                  <option
                    key={a._id}
                    value={a._id}
                  >
                    {a.name}
                  </option>
                ))}
              </AppTextField>
            </Grid>

            {/* Category */}
            <Grid size={{ xs: 12, md: 6 }}>
              <AppTextField
                label="Category"
                select
                fullWidth
                {...fieldProps("category")}
              >
                <option
                  value=""
                  disabled
                  hidden
                >
                  -- Select Category --
                </option>
                {categories.map((c) => (
                  <option
                    key={c._id}
                    value={c._id}
                  >
                    {c.name}
                  </option>
                ))}
              </AppTextField>
            </Grid>

            {/* Status */}
            <Grid size={{ xs: 12, md: 6 }}>
              <AppTextField
                label="Status"
                select
                fullWidth
                SelectProps={{ native: true }}
                {...fieldProps("status")}
              >
                <option value="AVAILABLE">Available</option>
                <option value="CHECKED_OUT">Borrowed</option>
                <option value="RESERVED">Maintenance</option>
                <option value="LOST">Lost</option>
              </AppTextField>
            </Grid>

            {/* ISBN */}
            <Grid size={{ xs: 12, md: 4 }}>
              <AppTextField
                label="ISBN"
                {...fieldProps("isbn")}
              />
            </Grid>

            {/* Published Year */}
            <Grid size={{ xs: 12, md: 4 }}>
              <AppTextField
                label="Published Year"
                type="number"
                {...fieldProps("publisher")}
              />
            </Grid>

            {/* Quantity */}
            <Grid size={{ xs: 12, md: 4 }}>
              <AppTextField
                label="Quantity"
                type="number"
                {...fieldProps("quantity")}
              />
            </Grid>

            {/* Description */}
            <Grid size={12}>
              <AppTextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                {...fieldProps("description")}
              />
            </Grid>
          </Grid>

          <FormAction
            onClose={onClose}
            loading={loading}
            label={mode === "add" ? "Add Book" : "Update Book"}
          />
        </form>
      </div>
    </div>
  );
};

export default BookModal;
