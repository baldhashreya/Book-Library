<<<<<<< HEAD:back_end/src/repositories/common.repository.ts
import { Types, UpdateResult } from "mongoose";
import Roles, { RoleModel } from "../../common/database/models/roles";
import { UsersModel, Users } from "../../common/database/models/users";
=======
import { UpdateResult } from "mongoose";
import { UsersModel, Roles, RoleModel, Users } from "common";
>>>>>>> 74355e3e0d8474fbefe72dfaf8d3a107a1bc230d:back_end/lambda/src/repositories/common.repository.ts

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
