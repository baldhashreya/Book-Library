import * as Yup from "yup";

export const bookSchema = Yup.object({
  title: Yup.string().required("Book title is required"),
  author: Yup.string().required("Author is required"),
  category: Yup.string().required("Category is required"),
  status: Yup.string().required("Status is required"),
  isbn: Yup.string(),
  publisher: Yup.number().nullable(),
  quantity: Yup.number().min(1).required("Quantity required"),
  description: Yup.string(),
});