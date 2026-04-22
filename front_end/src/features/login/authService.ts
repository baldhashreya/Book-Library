import type { LoginFormData, LoginResponse, User } from "../../types/auth";
import { apiService } from "../../services/api";

export const authService = {
  async login(credentials: LoginFormData): Promise<LoginResponse> {
    try {
      const response: any = await apiService.post("/auth/login", credentials);
      console.log(response);
      if (!response || !response.data) {
        throw new Error("Login failed");
      }
      if (response.data && response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
      }
      return response;
    } catch (error) {
      console.error("Login API error:", error);
      return {
        success: false,
        message:
          error instanceof Error ?
            error.message
          : "Unable to connect to server. Please try again.",
      };
    }
  },

  // Register new user
  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<LoginResponse> {
    try {
      const response: any = await apiService.post("/auth/signup", userData);

      if (response && response.data) {
        return {
          success: true,
          user: response.data,
          message: response.message || "Registration successful!",
        };
      } else {
        return {
          success: false,
          message: response?.message || "Registration failed.",
        };
      }
    } catch (error) {
      console.error("Registration API error:", error);
      return {
        success: false,
        message:
          error instanceof Error ?
            error.message
          : "Unable to connect to server. Please try again.",
      };
    }
  },

  // Logout
  async logout(): Promise<void> {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await apiService.post("/auth/logout", {});
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("authToken"); // Remove legacy key if any
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token) {
      return null;
    }

    try {
      const result = await apiService.get("/profile/me");
      return result.data || null;
    } catch (error) {
      console.error("Failed to get current user:", error);
      // Return cached user if API fails
      return userStr ? JSON.parse(userStr) : null;
    }
  },

  // Forgot password
  async forgotPassword(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const data: any = await apiService.post("/auth/forgot-password", {
        email,
      });
      return {
        success: data?.success || true,
        message:
          data?.message ||
          "If an account exists with this email, you will receive a reset link.",
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      return {
        success: false,
        message:
          error instanceof Error ?
            error.message
          : "Failed to send reset email.",
      };
    }
  },

  // Reset password
  async resetPassword(
    email: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const data: any = await apiService.post("/auth/reset-password", {
        email,
        password: newPassword,
      });
      console.log(data);
      return {
        success: data?.success || true,
        message: data?.message || "Password reset successfully.",
      };
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to reset password.",
      };
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },

  // Get stored user
  getStoredUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};
