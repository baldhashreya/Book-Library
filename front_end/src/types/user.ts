export interface User {
  _id: string;
  name: string;
  email: string;
  role: {
    _id: string;
  };
  roleName?: string;
  status: "active" | "inactive";
  createdAt: string;
  lastLogin?: string;

  contactInfo: {
    phone: number;
    address: string;
  };
}

export interface UserFormData {
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
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
