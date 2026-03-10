import { RoleModel, Roles } from "common";
import { RolesSearchParams } from "../interface/common.interface";

export class RolesRepository {
  public async createRole(params: RoleModel): Promise<RoleModel> {
    return Roles.create(params);
  }

  public async updateRoleById(
    param: RoleModel,
    id: string,
  ): Promise<RoleModel | null> {
    return Roles.findByIdAndUpdate({ _id: id }, { ...param });
  }

  public async deleteRoleById(id: string): Promise<RoleModel | null> {
    return Roles.findByIdAndDelete({ _id: id });
  }

  public async searchRoles(
    params: RolesSearchParams,
  ): Promise<{ rows: RoleModel[]; count: number }> {
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
    const count = await Roles.countDocuments(query);
    const rows = await Roles.find(query)
      .sort(order)
      .skip(params.offset || 0)
      .limit(params.limit || 10);
    return { count, rows };
  }

  public async getRoleByName(name: string, id?: String): Promise<number> {
    if (id) {
      return Roles.countDocuments({ name, _id: { $ne: id } });
    }
    return Roles.countDocuments({ name });
  }
}
