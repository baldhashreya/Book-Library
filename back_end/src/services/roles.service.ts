import { Types } from "mongoose";
import { RoleModel } from "../../common/database/models/roles";
import { ErrorType } from "../../common/enum";
import { RolesSearchParams } from "../interface/common.interface";
import { CommonRepository } from "../repositories/common.repository";
import { RolesRepository } from "../repositories/roles.repository";

export class RolesServices {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly commonRepository: CommonRepository
  ) {
    this.rolesRepository = rolesRepository;
    this.commonRepository = commonRepository;
  }

  public async createRole(params: RoleModel): Promise<RoleModel> {
    const existingRole = await this.rolesRepository.getRoleByName(params.name);

    if (existingRole) {
      const err = new Error();
      err.name = ErrorType.RoleIsUnique;
      return Promise.reject(err);
    }

    return this.rolesRepository.createRole(params);
  }

  public async updateRoleById(
    params: RoleModel,
    id: string
  ): Promise<RoleModel | null> {
    const existingRole = await this.rolesRepository.getRoleByName(
      params.name,
      id
    );

    if (existingRole) {
      const err = new Error();
      err.name = ErrorType.RoleIsUnique;
      return Promise.reject(err);
    }
    const roleUpdated = await this.rolesRepository.updateRoleById(params, id);
    if (!roleUpdated) {
      const err = new Error();
      err.name = ErrorType.RoleNotFound;
      return Promise.reject(err);
    }
    return roleUpdated;
  }

  public async deleteRoleById(id: string): Promise<RoleModel | null> {
    const roleDeleted = await this.rolesRepository.deleteRoleById(id);
    if (!roleDeleted) {
      const err = new Error();
      err.name = ErrorType.RoleNotFound;
      return Promise.reject(err);
    }
    return roleDeleted;
  }

  public async searchRoles(params: RolesSearchParams): Promise<RoleModel[]> {
    return this.rolesRepository.searchRoles(params);
  }

  public async getRoleById(id: string): Promise<RoleModel | null> {
    return this.commonRepository.getRoleById(id);
  }
}
