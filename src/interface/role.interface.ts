import { RolePermission } from "../../common/enum";
import { SearchParams } from "../../common/interface";

export interface RolesSearchParams extends SearchParams {
  name?: string;
  permissions?: RolePermission[];
  description?: string;
}
