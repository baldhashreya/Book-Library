import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import "./Login.css";

interface LoginProps {
  onSwitchToSignup?: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup = () => {} }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

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
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
        else{
          localStorage.setItem("user", JSON.stringify({ email }));
        }
        await login(email, password);

        console.log("Login successful, redirecting to dashboard...");
        navigate("/dashboard");
      } else {
        setError(
          response.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      setError(
        "Unable to connect to server. Please check your internet connection."
      );
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForgotPassword(true);
    setError("");
    setResetSuccess(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(resetEmail);

      if (response.success) {
        setResetSuccess(true);
        setError("");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setResetEmail("");
    setError("");
    setResetSuccess(false);
  };

  // Forgot Password View
  if (showForgotPassword) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>Reset Password</h2>
          <p className="forgot-password-text">
            {resetSuccess
              ? "Check your email for a password reset link."
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>

          {error && <div className="error-message">{error}</div>}

          {resetSuccess ? (
            <div className="success-message">
              <p>
                If an account exists with <strong>{resetEmail}</strong>, you
                will receive a password reset link shortly.
              </p>
              <button
                type="button"
                className="back-button"
                onClick={handleBackToLogin}
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form
              className="login-form"
              onSubmit={handleResetPassword}
            >
              <div className="form-group">
                <label htmlFor="reset-email">Email Address</label>
                <input
                  type="email"
                  id="reset-email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
              <button
                type="button"
                className="back-button"
                onClick={handleBackToLogin}
                disabled={isLoading}
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Login View
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Sign in to your Book Library account</p>

        {error && <div className="error-message">{error}</div>}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="forgot-password-container">
            <button
              type="button"
              className="forgot-password-link"
              onClick={handleForgotPassword}
              disabled={isLoading}
            >
              Forgot Password?
            </button>
          </div>
        </form>

        <div className="signup-section">
          <p>
            Don't have an account?
            <button
              type="button"
              className="signup-link"
              onClick={onSwitchToSignup}
              disabled={isLoading}
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
