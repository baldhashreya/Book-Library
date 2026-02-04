import React, { useState } from "react";
import "./Login.css";
import "../../../shared/styles/common.css";

import { LoginPageHeader } from "../components/LoginPageHeader";
import { ForgotPassword } from "../components/ForgotPassword";
import { LoginForm } from "../components/LoginForm";
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setResetEmail("");
    setResetSuccess(false);
    setError("");
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
        {error && <div className="error-message">{error}</div>}
        {showForgotPassword ?
          <ForgotPassword
            email={email}
            password={password}
            isLoading={isLoading}
            setShowForgotPassword={setShowForgotPassword}
            handleBackToLogin={handleBackToLogin}
            setIsLoading={setIsLoading}
            setResetEmail={setResetEmail}
            loading={isLoading}
          />
        : <LoginForm
            setIsLoading={setIsLoading}
            loading={isLoading}
            setShowForgotPassword={setShowForgotPassword}
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
          />
        }
      </div>
    </div>
  );
};
export default Login;
