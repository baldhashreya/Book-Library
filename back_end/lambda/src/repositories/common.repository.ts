import { UpdateResult } from "mongoose";
import { UsersModel, Roles, RoleModel, Users } from "common";

export class CommonRepository {
  public async getRoles(): Promise<RoleModel[]> {
    return Roles.find();
  }
  public async getRoleById(id: string): Promise<RoleModel | null> {
    return Roles.findById({ _id: id });
  }

  public async updateUser(
    param: UsersModel,
    id: string
  ): Promise<UpdateResult> {
    return Users.updateOne({ _id: id }, { ...param });
  }

  public async getUserById(id: string): Promise<UsersModel | null> {
    return Users.findById({ _id: id }).populate("role", "name");
  }

  public async createUser(param: UsersModel): Promise<UsersModel> {
    return Users.create(param);
  }
}
