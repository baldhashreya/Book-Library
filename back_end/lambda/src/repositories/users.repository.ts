<<<<<<< HEAD:back_end/src/repositories/users.repository.ts
import { UsersModel, Users } from "../../common/database/models/users";
=======
import { UsersModel, Users } from "common";
>>>>>>> 74355e3e0d8474fbefe72dfaf8d3a107a1bc230d:back_end/lambda/src/repositories/users.repository.ts
import { UsersSearchParams } from "../interface/common.interface";

export class UsersRepository {
  public async createUsers(param: UsersModel[]): Promise<void> {
    await Users.insertMany(param);
  }

  public async deleteUser(id: string): Promise<UsersModel | null> {
    return Users.findByIdAndDelete({ _id: id });
  }

  public async searchUsers(params: UsersSearchParams): Promise<UsersModel[]> {
    let query = {};
    if (params.name) {
      query = { ...query, userName: { $regex: params.name, $options: "i" } };
    }
    if (params.email) {
      query = { ...query, email: { $regex: params.email, $options: "i" } };
    }
    if (params.status) {
      query = { ...query, status: params.status };
    }
    if (params.role) {
      query = { ...query, role: params.role };
    }

    let order = {};
    if (params.order && params.order.length && params.order[0]?.length) {
      let orderDirection = params.order[0][1] ? params.order[0][1] : "desc";
      let direction = orderDirection.toLowerCase() === "asc" ? 1 : -1;
      order = { [String(params.order[0][0])]: direction };
    } else {
      order = { createdAt: -1 };
    }
    return Users.find(query).populate("role", "name")
      .sort(order)
      .skip(params.offset || 0)
      .limit(params.limit || 10);
  }

   public async getUserByEmail(email: string, id?: string): Promise<number> {
    if (id) {
      return Users.countDocuments({ email, _id: { $ne: id } });
    }
    return Users.countDocuments({ email });
  }
}
