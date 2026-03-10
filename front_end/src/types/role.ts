export type RolePermission = 
  | 'manage_users' 
  | 'manage_books' 
  | 'manage_roles' 
  | 'view_reports' 
  | 'issue_books' 
  | 'return_books'
  | 'view_books'
  | 'borrow_books'
  | 'view_borrow_history';

export interface Role {
  _id: string;
  name: string;
  permissions: RolePermission[];
  description: string;
}

export interface RoleFormData {
  name: string;
  permissions: RolePermission[];
  description: string;
}

export interface RoleSearchParams extends SearchParams {
  name?: string;
  permissions?: RolePermission[];
  description?: string;
}
export interface SearchParams {
  offset?: number;
  limit?: number;
  order?: string[][];
}
