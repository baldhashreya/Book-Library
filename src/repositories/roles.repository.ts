import Roles, { RoleModel } from "../../common/database/models/roles";
import { RolesSearchParams } from "../interface/role.interface";

export class RolesRepository {
  public async createRole(params: RoleModel): Promise<RoleModel> {
    return Roles.create(params);
  }

  public async updateRoleById(param: RoleModel, id: string): Promise<RoleModel | null> {
    return Roles.findByIdAndUpdate({ _id: id },{ ...param });
  }

  public async deleteRoleById(id: string): Promise<RoleModel | null> {
    return Roles.findByIdAndDelete({ _id: id });
  }

  public async searchRoles(params: RolesSearchParams): Promise<RoleModel[]> {
    let query = {};
    if (params.name) {
      query = { ...query, name: { $regex: params.name, $options: "i" } };
    }
    if (params.permissions) {
      query = { ...query, permissions: { $in: params.permissions } };
    }
    if (params.description) {
      query = {
        ...query,
        description: { $regex: params.description, $options: "i" },
      };
    }

    let order = {};
    if (params.order && params.order.length && params.order[0]?.length) {
      let orderDirection = params.order[0][1] ? params.order[0][1] : "desc";
      let direction = orderDirection.toLowerCase() === "asc" ? 1 : -1;
      order = { [String(params.order[0][0])]: direction };
    } else {
      order = { createdAt: -1 };
    }
    return Roles.find(query)
      .sort(order)
      .skip(params.offset || 0)
      .limit(params.limit || 10);
  }

  public async getRoleByName(name: string, id?: String): Promise<number> {
    if (id) {
      return Roles.countDocuments({ name, _id: { $ne: id } });
    }
    return Roles.countDocuments({ name });
  }
}
