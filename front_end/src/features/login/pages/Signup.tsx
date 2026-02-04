import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../shared/styles/common.css";
import type { signupFormData } from "../../../types/auth";
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

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<signupFormData>({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const result = await roleService.searchRoles({ limit: 100, offset: 0 });
      console.log("result", result);
      setRoles(result);
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      delete formData.confirmPassword;
      await authService.register(formData);
      alert("Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Failed to create account!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="signup-card">
        <LoginPageHeader />
        <h2>Create your TatvaLib account</h2>
        <p className="login-subtitle">Start managing your library in minutes</p>
        <form onSubmit={handleSubmit}>
          <Box sx={{ "& > :not(style)": { m: 1, width: "300px" } }}>
            <TextField
              label="Name"
              name="name"
              variant="outlined"
              type="text"
              placeholder="Enter name"
              required
              disabled={loading}
              value={formData.name}
              onChange={handleChange}
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
              label="Email"
              name="email"
              variant="outlined"
              type="email"
              placeholder="Enter email"
              required
              disabled={loading}
              value={formData.email}
              onChange={handleChange}
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
              label="Password"
              name="password"
              variant="outlined"
              type="password"
              placeholder="Enter password"
              required
              disabled={loading}
              value={formData.password}
              onChange={handleChange}
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
              label="Role"
              variant="outlined"
              type="email"
              name="role"
              required
              disabled={loading}
              value={formData.role}
              onChange={handleChange}
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
