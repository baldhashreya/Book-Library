import { Types, UpdateResult } from "mongoose";
import Roles, { RoleModel } from "../../common/database/models/roles";
import Users, { UsersModel } from "../../common/database/models/users";

export class CommonRepository {
  public async getRoles(): Promise<RoleModel[]> {
    return Roles.find();
  }
  public async getRoleById(id: Types.ObjectId): Promise<RoleModel | null> {
    return Roles.findById({ _id: id });
  }

  public async updateUser(
    param: UsersModel,
    id: string
  ): Promise<UpdateResult> {
    return Users.updateOne({ _id: id }, { ...param });
  }

  public async getUserById(id: string): Promise<UsersModel | null> {
    return Users.findById({ _id: id }).populate("role","name");
  }
}
