import type { UserFormData, UsersSearchParams } from "../../types/user";
import { apiService } from "../../services/api";

export interface UserExistsResponse {
  exists: boolean;
  message?: string;
}

export const userService = {
  // Test backend connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/health`);
        return response.ok;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Backend connection failed:", error);
      return false;
    }
  },

  // Get all users
  async getUsers(params: UsersSearchParams) {
    try {
      const result = await apiService.post("/users/search", params);
      return JSON.parse(JSON.stringify(result.data)) || {};
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  async getUserById(id: string){
    try {
      const result = await apiService.get(`/users/${id}`);
      return result;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  // Create new user
  async createUser(userData: UserFormData){
    try {
      const data = await apiService.post("/users", userData);
      return data.user;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Update user
  async updateUser(id: string, userData: UserFormData){
    try {
      const data = await apiService.put(`/users/${id}`, userData);
      return data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating user:", error);
      throw error;
    }
  },

  async deleteUser(id: string): Promise<void> {
    // Delete user
    try {
      await apiService.delete(`/users/${id}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  // Get roles for dropdown
  async getRolesForDropdown() {
    try {
      const result = await apiService.post("/roles/search", {});
      return (result.data || []).map((role: any) => ({
        value: role._id,
        label: role.name,
      }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching roles:", error);
      return [];
    }
  },

  async changeUserStatus(id: string): Promise<void> {
    try {
      await apiService.patch(`/users/${id}/status`, {} as FormData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};
