import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import { TextField, Button, Box, Link } from "@mui/material";
import "./Login.css";
import CustomButton from "../common/Button/CustomButton";
import "../common/common-css/login.css";
import BookImage from "../../assets/first-image.jpg";
import CustomLink from "../common/CustomLink";
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [newResetPassword, setNewResetPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  console.log("after logout");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      if (response.data && response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        const user = await authService.getCurrentUser();
        localStorage.setItem("user", JSON.stringify(user || { email }));
        await login(email, password);
        navigate("/dashboard");
      } else {
        setError(response.message || "Login failed. Please check credentials.");
      }
    } catch (err) {
      setError("Unable to connect to server.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setError("");
  };
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.resetPassword(resetEmail, newResetPassword);
      alert("Password reset successfully!");
      setShowForgotPassword(false);
    } catch (err) {
      setError("Failed to reset password. Try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setResetEmail("");
    setResetSuccess(false);
    setError("");
  };
  if (showForgotPassword) {
    return (
      <div className="login-container">
        <div className="login-img">
          <img
            src={BookImage}
            alt="Book Library Logo"
          />
        </div>
        <div className="login-card">
          <h2>Reset Password</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleResetPassword}>
            <Box
             
              sx={{ "& > :not(style)": { m: 1, width: "300px" } }}
            >
              <TextField
                label="email"
                variant="standard"
                type="email"
                placeholder="Enter email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <TextField
                label="password"
                variant="standard"
                type="password"
                placeholder="Enter new password"
                required
                value={newResetPassword}
                onChange={(e) => setNewResetPassword(e.target.value)}
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
            <Link
              component="button"
              variant="body2"
              onClick={handleBackToLogin}
              className="back-button"
              sx={{ fontWeight: "500", fontSize: "15px", marginTop: "10px" }}
            >
              Back to Login
            </Link>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="login-container">
      <div className="login-img">
        <img
          src={BookImage}
          alt="Book Library Logo"
        />
      </div>
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Sign in to your Book Library</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <Box sx={{ "& > :not(style)": { m: 1, width: "300px" } }}>
            <TextField
              label="email"
              variant="standard"
              type="email"
              placeholder="Enter email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            
            />
            <TextField
              label="password"
              variant="standard"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <div className="forgot-password">
              <Link
                component="button"
                variant="body2"
                onClick={handleForgotPassword}
                color="#4F46E5"
                sx={{ fontWeight: "500", fontSize: "15px" }}
              >
                Forgot Password?
              </Link>
            </div>
            {/* Login button */}
            <div className="login-btn">
              <CustomButton
                className="login-button"
                disabled={isLoading}
                label={isLoading ? "Signing In..." : "Sign In"}
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
    </div>
  );
};
export default Login;
