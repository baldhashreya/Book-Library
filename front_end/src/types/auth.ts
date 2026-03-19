export interface LoginFormData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginResponse {
  message?: string;
  data?: any;
  success?: boolean;
  user?: User;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  refreshUser?: () => Promise<boolean>;
}

export interface signupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}
