import {
  TextField,
  Box,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../../contexts/AuthContext";
import { authService } from "../authService";
import { toast } from "react-toastify";
import {
  EmailOutlined,
  LockOutlined,
  VisibilityOff,
  Visibility,
} from "@mui/icons-material";
import CustomButton from "../../../shared/components/Button/CustomButton";
import CustomLink from "../../../shared/components/CustomLink";
import "../pages/Login.css";
import "../../../shared/styles/common.css";

interface props {
  setIsLoading: any;
  loading: boolean;
  setShowForgotPassword: any;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export function LoginForm({
  setIsLoading,
  loading,
  setShowForgotPassword,
}: props) {
  const { login } = useAuth();
  const navigate = useNavigate();
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
        const response = await authService.login(values);
        if (response.data && response.data.access_token) {
          localStorage.setItem("token", response.data.access_token);
          localStorage.setItem("refresh_token", response.data.refresh_token);
          const user = await authService.getCurrentUser();
          localStorage.setItem("user", JSON.stringify(user || { email: values.email }));
          await login(values.email, values.password);
          toast.success(response.message);
          navigate("/dashboard");
        } else {
          toast.error(
            response.message || "Login failed. Please check credentials.",
          );
        }
      } catch (err) {
        console.error(err);
        toast.error("Unable to connect to server.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleToggle = () => {
    setShowPassword((prev) => !prev);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
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
            disabled={loading}
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
            label="Password"
            variant="outlined"
            placeholder="Enter password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            disabled={loading}
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
          <div className="forgot-password">
            <Link
              component="button"
              variant="body1"
              onClick={handleForgotPassword}
              sx={{ color: "var(--primary-main)", fontWeight: "500", fontSize: "13px" }}
            >
              Forgot Password?
            </Link>
          </div>
          {/* Login button */}
          <div className="login-btn">
            <CustomButton
              className="login-button"
              disabled={loading}
              label={loading ? "Signing In..." : "Sign In"}
              variant="contained"
              type="submit"
            />
          </div>
        </Box>
      </form>
      <div className="signup-section">
        <p>
          Don’t have an account?
          <CustomLink
            component="button"
            variant="body2"
            onClick={() => navigate("/signup")}
            label="SignUp"
            className="redirect-link"
          />
        </p>
      </div>
    </div>  
  );
}
