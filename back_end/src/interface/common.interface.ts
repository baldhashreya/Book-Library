import { RolePermission } from "../../common/enum";
import { SearchParams } from "../../common/interface";

export interface RolesSearchParams extends SearchParams {
  name?: string;
  permissions?: RolePermission[];
  description?: string;
}

export interface UsersSearchParams extends SearchParams {
  name?: string;
  email?: string;
  status?: string;
  role?: string;
}

export interface CategoriesSearchParams extends SearchParams {
  name?: string;
  status?: string;
}

export interface AuthorsSearchParams extends SearchParams {
  name?: string;
  bio?: string;
  start_birth_date?: Date;
  end_birth_date?: Date;
}
