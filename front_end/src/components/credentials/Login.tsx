import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import "./Login.css";

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
        <div className="login-card">
          <h2>Reset Password</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newResetPassword}
                onChange={(e) => setNewResetPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>

            <button
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>

            <button
              type="button"
              className="back-button"
              onClick={handleBackToLogin}
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Login UI
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Sign in to your Book Library</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Login button */}
          <button
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {/* Forgot password aligned right */}
          <div className="forgot-password">
            <button
              type="button"
              className="forgot-password-link"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>
        </form>

        <div className="signup-section">
          <p>
            Don’t have an account?{" "}
            <button
              type="button"
              className="signup-link"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
