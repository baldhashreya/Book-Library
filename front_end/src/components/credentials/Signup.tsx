import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../common/common-css/common.css";
import type { signupFormData } from "../../types/auth";
import { roleService } from "../../services/roleService";
import type { Role } from "../../types/role";
import { authService } from "../../services/authService";
import { TextField, Box, MenuItem } from "@mui/material";
import CustomButton from "../common/Button/CustomButton";
import CustomLink from "../common/CustomLink";
import BlueLogo from "../../assets/logo-blue.svg"

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<signupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      <div className="login-card">
        <img src={BlueLogo} alt="Logo"/>
        <h2>Create an Account</h2>
        <p className="login-subtitle">Join our Book Library</p>
        <form onSubmit={handleSubmit}>
          <Box sx={{ "& > :not(style)": { m: 1, width: "300px" } }}>
            <TextField
              fullWidth
              label="Name"
              variant="standard"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Email Address"
              variant="standard"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Password"
              variant="standard"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <TextField
              select
              label="Select Role"
              variant="standard"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              required
              sx={{
                width: "150px",
              }}
            >
              <MenuItem
                value=""
                disabled
              >
                -- Select Role --
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
