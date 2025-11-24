export interface User {
  id: string;
  firstName: string;
  userName: string;
  lastName: string;
  email: string;
  role: string;
  roleName?: string;
  status: "active" | "inactive";
  createdAt: string;
  lastLogin?: string;
  phone: number;
  address: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status?: "active" | "inactive";
  phone: number;
  address: string;
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
