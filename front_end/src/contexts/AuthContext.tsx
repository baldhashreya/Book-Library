import React, { createContext, useContext, useState } from 'react';
import { authService } from '../services/authService';

// Define User interface
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return a default auth context if not in provider
    return {
      user: null,
      isAuthenticated: false,
      login: async () => false,
      logout: () => {},
      loading: false
    };
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      // This might be making another API call or expecting different parameters
      const response = await authService.login({ email, password });
      console.log('AuthContext login response:', response);
      if (response.data?.access_token) {
        setToken(response.data.access_token);
        // Store token and user data
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        
        // You might need to fetch user data here
        const userData = { email }; // or fetch user profile
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('AuthContext login error:', error);
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login }}>
      {children}
    </AuthContext.Provider>
  );
};