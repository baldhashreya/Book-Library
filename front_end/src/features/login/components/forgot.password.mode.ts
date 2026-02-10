import * as Yup from "yup";

export const forgotPasswordSchema = Yup.object({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});