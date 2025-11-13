import React, { useState } from 'react';
import './Login.css';

interface SignupProps {
  onSwitchToLogin: () => void;
  onSignup: (email: string, password: string, confirmPassword: string) => void;
}

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirmPassword) {
      onSignup(email, password, confirmPassword);
    } else {
      alert("Passwords don't match!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Create Account</h2>
        <p className="login-subtitle">Join our Book Library community</p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="signup-email">Email Address</label>
            <input
              type="email"
              id="signup-email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input
              type="password"
              id="signup-password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-button">
            Create Account
          </button>
        </form>
        
        <div className="signup-section">
          <p>Already have an account? 
            <button 
              type="button" 
              className="signup-link"
              onClick={onSwitchToLogin}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;