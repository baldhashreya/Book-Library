import type { LoginFormData, LoginResponse, User } from '../types/auth';
import { apiService } from './api';

export const authService = {
  async login(credentials: LoginFormData): Promise<LoginResponse> {
    try {
      const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  const data = await response.json();
  return data
    } catch (error) {
      console.error('Login API error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unable to connect to server. Please try again.'
      };
    }
  },

  // Register new user
  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<LoginResponse> {
    try {
      const data = await apiService.post('/auth/register', userData);
      
      if (data.success && data.user && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('refreshToken', data.refreshToken || '');

        return {
          success: true,
          user: data.user,
          token: data.token,
          message: data.message || 'Registration successful!'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Registration failed.'
        };
      }
    } catch (error) {
      console.error('Registration API error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unable to connect to server. Please try again.'
      };
    }
  },

  // Logout
  async logout(): Promise<void> {
    const token = localStorage.getItem('authToken');
    
    try {
      if (token) {
        await apiService.post('/auth/logout', {});
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');

    if (!token) {
      return null;
    }

    try {
      const data = await apiService.get('/auth/me');
      
      if (data.success && data.user) {
        const freshUser = data.user;
        localStorage.setItem('user', JSON.stringify(freshUser));
        return freshUser;
      }
      return null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      // Return cached user if API fails
      try {
        return userStr ? JSON.parse(userStr) : null;
      } catch {
        return null;
      }
    }
  },

  // Forgot password
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const data = await apiService.post('/auth/forgot-password', { email });
      return {
        success: data.success,
        message: data.message || 'If an account exists with this email, you will receive a reset link.'
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send reset email.'
      };
    }
  },

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const data = await apiService.post('/auth/reset-password', { token, newPassword });
      return {
        success: data.success,
        message: data.message || 'Password reset successfully.'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reset password.'
      };
    }
  },

  // Check authentication status
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },

  // Get stored user
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};