export interface User {
  id: string;
  userName: string;
  email: string;
  role: string; // Role ID
  roleName?: string; // For display
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface UserFormData {
  userName: string;
  email: string;
  role: string;
  status?: 'active' | 'inactive';
}

export interface UsersSearchParams extends SearchParams {
  name?: string;
  email?: string;
  status?: string;
  role?: string;
}

export interface SearchParams {
  offset?: number;
  limit?: number;
  order?: string[];
}