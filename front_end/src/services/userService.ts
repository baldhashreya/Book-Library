import type { User, UserFormData } from '../types/user';
import { apiService } from './api';

export interface UserExistsResponse {
  exists: boolean;
  message?: string;
}

export const userService = {
  // Test backend connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing backend connection...');
      const response = await fetch('http://localhost:5000/api/health');
      console.log('✅ Backend connection test:', response.status, response.statusText);
      return response.ok;
    } catch (error) {
      console.error('💥 Backend connection failed:', error);
      return false;
    }
  },

  // Get all users
  async getUsers(): Promise<User[]> {
    try {

      const result = await apiService.post('/users/search', {});
      return JSON.parse(JSON.stringify(result.data)) || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    try {
      console.log(`userService.getUserById(${id}) called`);
      const data = await apiService.get(`/users/${id}`);
      return data.user || null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create new user
  async createUser(userData: UserFormData): Promise<User> {
    try {
      console.log('userService.createUser() called:', userData);
      const data = await apiService.post('/users', userData);
      return data.user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(id: string, userData: UserFormData): Promise<User> {
    try {
      console.log(`userService.updateUser(${id}) called:`, userData);
      const data = await apiService.put(`/users/${id}`, userData);
      return data.user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    try {
      console.log(`🔄 userService.deleteUser(${id}) called`);
      await apiService.delete(`/users/${id}`);
    } catch (error) {
      console.error('💥 Error deleting user:', error);
      throw error;
    }
  },

  // Get roles for dropdown
  async getRolesForDropdown() {
    try {
      console.log('userService.getRolesForDropdown() called');
      const result = await apiService.post('/roles/search', {});
      return (result.data || []).map((role: any) => ({
        value: role.id,
        label: role.name
      }));
    } catch (error) {
      console.error('💥 Error fetching roles:', error);
      return [];
    }
  }
};