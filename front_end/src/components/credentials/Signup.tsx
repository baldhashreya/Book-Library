import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import type { signupFormData } from "../../types/auth";
import { roleService } from "../../services/roleService";
import type { Role } from "../../types/role";
import { authService } from "../../services/authService";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<signupFormData>({
    firstName: "",
    lastName: "",
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
      setRoles(result);
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create an Account</h2>
        <p className="signup-subtitle">Join our Book Library</p>

        <form onSubmit={handleSubmit}>
          {/* NAME ROW */}
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          {/* EMAIL + ROLE */}
          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="form-group">
              <label>Select Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="" disabled hidden>
                  -- Select Role --
                </option>

                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PASSWORD ROW */}
          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
            </div>
          </div>

          <button className="signup-button" disabled={loading}>
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{" "}
            <button className="signup-link" onClick={() => navigate("/login")}>
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
