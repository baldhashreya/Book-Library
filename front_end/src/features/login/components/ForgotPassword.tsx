import {
  Box,
  IconButton,
  InputAdornment,
  Link,
  TextField,
} from "@mui/material";
import CustomButton from "../../../shared/components/Button/CustomButton";
import { useState } from "react";
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
  email: string;
  password: string;
  isLoading: boolean;
  setShowForgotPassword: any;
  handleBackToLogin: any;
  setIsLoading: any;
  setResetEmail: any;
  loading: boolean;
}

export function ForgotPassword({
  email,
  password,
  isLoading,
  setShowForgotPassword,
  handleBackToLogin,
  setIsLoading,
  setResetEmail,
  loading,
}: props) {
  const [newResetPassword, setNewResetPassword] = useState(password);
  const [showPassword, setShowPassword] = useState(false);
  const handleToggle = () => {
    setShowPassword((prev) => !prev);
  };
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.resetPassword(email, newResetPassword);
      toast.success(response.message);
      setShowForgotPassword(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to reset password. Try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login-form">
      <form onSubmit={handleResetPassword}>
        <Box sx={{ "& > :not(style)": { m: 1, width: "260px" } }}>
          <TextField
            label="email"
            variant="outlined"
            type="email"
            placeholder="Enter email"
            required
            disabled={loading}
            value={email}
            onChange={(e) => setResetEmail(e.target.value)}
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
            label="password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            required
            value={newResetPassword}
            disabled={loading}
            onChange={(e) => setNewResetPassword(e.target.value)}
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
