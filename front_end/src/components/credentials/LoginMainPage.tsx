import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";
import {
  TextField,
  Box,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import "./Login.css";
import CustomButton from "../common/Button/CustomButton";
import "../common/common-css/common.css";

import CustomLink from "../common/CustomLink";
import {
  EmailOutlined,
  LockOutlined,
  VisibilityOff,
  Visibility,
} from "@mui/icons-material";
import { LoginPageHeader } from "./LoginPageHeader";
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
 
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => {
    setShowPassword((prev) => !prev);
  };
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
        toast.success(response.message || "Login successful!");
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
          <div className="login-header">
            <img
              src={BlueLogo}
              alt="Logo"
            />
            <h1>TatvaLib</h1>
          </div>
          <h2>Reset Password</h2>
          <p className="login-subtitle">
            Enter a new password to regain access to TatvaLib
          </p>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleResetPassword}>
            <Box sx={{ "& > :not(style)": { m: 1, width: "300px" } }}>
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
      <div className="login-card">
        <LoginPageHeader />
        <h2>
          {showForgotPassword ? "Reset Password" : "Welcome Back To TatvaLib"}
        </h2>
        <p className="login-subtitle">
          {showForgotPassword ?
            "Enter a new password to regain access to TatvaLib"
          : "Sign in to your Book Library"}
        </p>
        {error && <div className="error-message">{error}</div>}
        {showForgotPassword ?
          <>
            <div className="login-form">
              <form onSubmit={handleSubmit}>
                <Box sx={{ "& > :not(style)": { m: 1, width: "260px" } }}>
                  <TextField
                    label="email"
                    variant="outlined"
                    type="email"
                    placeholder="Enter email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined
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
                    label="password"
                    variant="outlined"
                    placeholder="Enter password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined
                            sx={{ color: "gray", fontSize: "20px" }}
                          />
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
                      color="#4F46E5"
                      sx={{ fontWeight: "500", fontSize: "13px" }}
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
              <form onSubmit={handleResetPassword}>
                <Box sx={{ "& > :not(style)": { m: 1, width: "300px" } }}>
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
                  sx={{
                    fontWeight: "500",
                    fontSize: "15px",
                    marginTop: "10px",
                  }}
                >
                  Back to Login
                </Link>
              </form>
            </div>
          </>
        : <>
            {error && <div className="error-message">{error}</div>}
            <div className="login-form">
              <form onSubmit={handleSubmit}>
                <Box sx={{ "& > :not(style)": { m: 1, width: "260px" } }}>
                  <TextField
                    label="email"
                    variant="outlined"
                    type="email"
                    placeholder="Enter email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined
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
                    label="password"
                    variant="outlined"
                    placeholder="Enter password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined
                            sx={{ color: "gray", fontSize: "20px" }}
                          />
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
                      color="#4F46E5"
                      sx={{ fontWeight: "500", fontSize: "13px" }}
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
          </>
        }
      </div>
    </div>
  );
};
export default Login;
