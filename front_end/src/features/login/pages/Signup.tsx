import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../../shared/styles/common.css";
import { roleService } from "../../role/roleService";
import type { Role } from "../../../types/role";
import { authService } from "../authService";
import { TextField, Box, MenuItem, InputAdornment } from "@mui/material";
import CustomButton from "../../../shared/components/Button/CustomButton";
import CustomLink from "../../../shared/components/CustomLink";
import { LoginPageHeader } from "../components/LoginPageHeader";
import {
  EmailOutlined,
  PersonOutlineOutlined,
  LockOutlined,
  PermContactCalendarOutlined,
} from "@mui/icons-material";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm Password is required'),
  role: Yup.string().required("Role is required"),
});

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const result = await roleService.searchRoles({ limit: 100, offset: 0 });
      setRoles(result.data.rows);
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const payload = {
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role
        };
        await authService.register(payload);
        alert("Account created successfully!");
        navigate("/login");
      } catch (error) {
        console.error("Error creating account:", error);
        alert("Failed to create account!");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="login-container">
      <div className="signup-card">
        <LoginPageHeader />
        <h2>Create your TatvaLib account</h2>
        <p className="login-subtitle">Start managing your library in minutes</p>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ "& > :not(style)": { m: 1, width: "300px" } }}>
            <TextField
              id="name"
              label="Name"
              name="name"
              variant="outlined"
              type="text"
              placeholder="Enter name"
              disabled={loading}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineOutlined
                      sx={{ color: "gray", fontSize: "20px" }}
                    />
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
              id="email"
              label="Email"
              name="email"
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
              label="Password"
              name="password"
              variant="outlined"
              type="password"
              placeholder="Enter password"
              disabled={loading}
              value={formik.values.password}
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
              id="confirmPassword"
              label="Confirm Password"
              name="confirmPassword"
              variant="outlined"
              type="password"
              placeholder="Confirm password"
              disabled={loading}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "gray", fontSize: "20px" }} />
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
              select
              id="role"
              label="Role"
              variant="outlined"
              name="role"
              disabled={loading}
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
              displayEmpty={true}
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected) => {
                  if (!selected || (selected as string).length === 0) {
                    return (
                      <span style={{ color: "#9e9e9e" }}>Select Role</span>
                    );
                  }
                  // Find and display the role name instead of the ID
                  const selectedRole = roles.find((r) => r._id === selected);
                  return selectedRole ?
                      selectedRole.name
                    : (selected as string);
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PermContactCalendarOutlined
                      sx={{ color: "gray", fontSize: "20px" }}
                    />
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
            >
              <MenuItem
                value=""
                disabled
              >
                Select Role
              </MenuItem>
              {roles.map((role) => (
                <MenuItem
                  key={role._id}
                  value={role._id}
                >
                  {role.name}
                </MenuItem>
              ))}
            </TextField>

            <div className="login-btn">
              <CustomButton
                className="login-button"
                type="submit"
                label={loading ? "Processing..." : "Sign Up"}
                onClick={() => {}}
                disabled={loading}
                variant="contained"
              />
            </div>
          </Box>
        </form>

        <div className="signup-section">
          <p>
            Already have an account?{" "}
            <CustomLink
              component="button"
              variant="body2"
              onClick={() => navigate("/login")}
              label="Sign In"
              className="redirect-link"
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
