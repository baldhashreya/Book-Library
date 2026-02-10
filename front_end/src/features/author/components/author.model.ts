import * as Yup from "yup";
export const authorSchema = Yup.object({
  name: Yup.string().required("Author name is required"),
  birthDate: Yup.string().required("Birth date is required"),
  bio: Yup.string()
    .required()
    .min(6, "Minimum 6 characters")
    .max(150, "Max 150 characters"),
});
