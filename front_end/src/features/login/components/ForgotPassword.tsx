import {
  Box,
  IconButton,
  InputAdornment,
  Link,
  TextField,
} from "@mui/material";
import CustomButton from "../../../shared/components/Button/CustomButton";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authService } from "../authService";
import { toast } from "react-toastify";
import "../../../shared/styles/common.css";
import {
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

interface props {
  isLoading: boolean;
  setShowForgotPassword: any;
  handleBackToLogin: any;
  setIsLoading: any;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
});

export function ForgotPassword({
  isLoading,
  setShowForgotPassword,
  handleBackToLogin,
  setIsLoading,
}: props) {
  const [showPassword, setShowPassword] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await authService.resetPassword(values.email, values.password);
        toast.success(response.message);
        setShowForgotPassword(false);
      } catch (err) {
        console.log(err);
        toast.error("Failed to reset password. Try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleToggle = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <div className="login-form">
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ "& > :not(style)": { m: 1, width: "260px" } }}>
          <TextField
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            type="email"
            placeholder="Enter email"
            disabled={isLoading}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined sx={{ color: "gray", fontSize: "20px" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 320,
              /* input text */
              "& .MuiInputBase-input": {
                fontSize: "12px", //text size
                padding: "10px", //vertical + horizontal padding
                color: "#6b6b6b",
              },
              /* outlined container */
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
              /* label */
              "& .MuiInputLabel-root": {
                fontSize: "13px",
                color: "#9e9e9e",
                marginBottom: "6px",
              },
              /* focused label */
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#7a7a7a",
              },
              /* icon spacing */
              "& .MuiInputAdornment-root": {
                marginRight: "6px",
              },
            }}
          />
          <TextField
            id="password"
            name="password"
            label="New Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={formik.values.password}
            disabled={isLoading}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: "gray", fontSize: "20px" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleToggle}
                    edge="end"
                  >
                    {showPassword ?
                      <VisibilityOff />
                    : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              width: 320,
              /* input text */
              "& .MuiInputBase-input": {
                fontSize: "12px", //text size
                padding: "10px", //padding
                color: "#6b6b6b",
              },
              /* outlined container */
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
              },
              /* label */
              "& .MuiInputLabel-root": {
                fontSize: "13px",
                color: "#9e9e9e",
                marginBottom: "6px",
              },
              /* focused label */
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#7a7a7a",
              },
              /* icon spacing */
              "& .MuiInputAdornment-root": {
                marginRight: "6px",
              },
            }}
          />

          <div className="login-btn">
            <CustomButton
              className="login-button"
              onClick={() => {}}
              disabled={isLoading}
              label={isLoading ? "Updating..." : "Update Password"}
              variant="contained"
              type="submit"
            />
          </div>
        </Box>
      </form>
      <div className="signup-section">
        <Link
          component="button"
          variant="body2"
          onClick={handleBackToLogin}
          className="back-button"
          sx={{
            fontWeight: "500",
            fontSize: "15px",
            marginTop: "10px",
          }}
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
