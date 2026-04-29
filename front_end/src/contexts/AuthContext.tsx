import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../features/login/authService";

export interface User {
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  logout: () => void;
  loading: boolean;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return a default auth context if not in provider
    return {
      user: null,
      isAuthenticated: false,
      login: async () => ({ success: false }),
      logout: () => {},
      loading: false,
      setUserData: () => {},
    };
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize state from local storage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserStr = localStorage.getItem("user");

    if (storedToken && storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        setToken(storedToken);
        setUser(storedUser);
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // This might be making another API call or expecting different parameters
      const response = await authService.login({ email, password });
      console.log("AuthContext login response:", response);
      if (response.data?.access_token) {
        setToken(response.data.access_token);
        // Store token and user data
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);

        // You might need to fetch user data here
        const userData = { email }; // or fetch user profile
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("AuthContext login error:", error);
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        loading,
        setUserData: setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
