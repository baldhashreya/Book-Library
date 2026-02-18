import * as Yup from "yup";

export const categorySchema = Yup.object({
  name: Yup.string()
    .max(50, "Max 50 characters")
    .required("Category name is required"),
  description: Yup.string()
    .max(200, "Max 200 characters")
    .required("Category description is required"),
  status: Yup.string().required("Status is required"),
});