import * as Yup from "yup";

export const editProfileSchema = Yup.object({
  name: Yup.string()
    .trim()
    .max(30, "Max 30 characters")
    .required("Name is required"),
  phone: Yup.string()
    .trim()
    .matches(/^[0-9]{10}$/, "Enter valid 10 digit phone")
    .required("Phone is required"),
  address: Yup.string()
    .trim()
    .max(150, "Max 150 characters")
    .min(10, "Min 10 characters")
    .required("Address is required"),
});
