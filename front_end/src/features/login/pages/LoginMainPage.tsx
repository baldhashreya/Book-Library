import React, { useState } from "react";
import "./Login.css";
import "../../../shared/styles/common.css";

import { LoginPageHeader } from "../components/LoginPageHeader";
import { ForgotPassword } from "../components/ForgotPassword";
import { LoginForm } from "../components/LoginForm";
const Login: React.FC = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };
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
        {showForgotPassword ?
          <ForgotPassword
            isLoading={isLoading}
            setShowForgotPassword={setShowForgotPassword}
            handleBackToLogin={handleBackToLogin}
            setIsLoading={setIsLoading}
          />
        : <LoginForm
            setIsLoading={setIsLoading}
            loading={isLoading}
            setShowForgotPassword={setShowForgotPassword}
          />
        }
      </div>
    </div>
  );
};
export default Login;
