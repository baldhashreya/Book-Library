import { Box, Link, TextField } from "@mui/material";
import CustomButton from "../common/Button/CustomButton";
import { useState } from "react";

export function ForgotPassword() {
  const [resetEmail, setResetEmail] = useState("");
  const [newResetPassword, setNewResetPassword] = useState("");
  return (
    <div className="login-form">
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
  );
}
