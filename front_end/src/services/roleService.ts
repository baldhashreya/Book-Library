import type { Role, RoleFormData, RolePermission, RoleSearchParams } from '../types/role';
import { apiService } from './api';

// Available permissions for selection
export const availablePermissions: { value: RolePermission; label: string }[] = [
  { value: 'manage_users', label: 'Manage Users' },
  { value: 'manage_books', label: 'Manage Books' },
  { value: 'manage_roles', label: 'Manage Roles' },
  { value: 'view_reports', label: 'View Reports' },
  { value: 'issue_books', label: 'Issue Books' },
  { value: 'return_books', label: 'Return Books' },
  { value: 'view_books', label: 'View Books' },
  { value: 'borrow_books', label: 'Borrow Books' },
  { value: 'view_borrow_history', label: 'View Borrow History' }
];

export const roleService = {
  // Get all roles
 async searchRoles(params: RoleSearchParams): Promise<{ 
    roles: Role[]; 
    total: number;
    offset: number;
    limit: number;
  }> {
    try {
      console.log('Advanced role search with params:', params);
      
      const result = await apiService.post('/roles/search', params);
      
      // Handle different response structures
      if (result && Array.isArray(result.data) && typeof result.total === 'number') {
        return {
          roles: result.data,
          total: result.total,
          offset: result.offset || 0,
          limit: result.limit || result.data.length
        };
      } else if (Array.isArray(result)) {
        return {
          roles: result,
          total: result.length,
          offset: 0,
          limit: result.length
        };
      } else {
        console.warn('Unexpected search response structure:', result);
        return {
          roles: [],
          total: 0,
          offset: 0,
          limit: 0
        };
      }
    } catch (error) {
      console.error('Error searching roles:', error);
      throw error;
    }
  },

  // Get role by ID
  async getRoleById(id: string): Promise<Role | null> {
    try {
      const data = await apiService.get(`/roles/${id}`);
      return data.role || null;
    } catch (error) {
      console.error('Error fetching role:', error);
      throw error;
    }
  },

  // Create new role
  async createRole(roleData: RoleFormData): Promise<Role> {
    try {
      const data = await apiService.post('/roles', roleData);
      return data.role;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  // Update role
  async updateRole(id: string, roleData: RoleFormData): Promise<Role> {
    try {
      const data = await apiService.put(`/roles/${id}`, roleData);
      return data.role;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  },

  // Delete role
  async deleteRole(id: string): Promise<void> {
    try {
      await apiService.delete(`/roles/${id}`);
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  }
};