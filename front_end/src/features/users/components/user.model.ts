import * as Yup from "yup";
export const UserValidationSchema = Yup.object({
  name: Yup.string().max(30).required("Name is required"),
  email: Yup.string().email().required("Email is required"),
  role: Yup.string().required("Role is required"),
  phone: Yup.number().required("Phone is required"),
  address: Yup.string().required("Address is required"),
  status: Yup.string(),
});