import { UpdateResult } from "mongoose";
import Users, { UsersModel } from "../../common/database/models/users";
import { UsersSearchParams } from "../interface/users.interface";

export class UsersRepository {
  public async createUsers(param: UsersModel[]): Promise<void> {
    await Users.insertMany(param);
  }
  public async createUser(param: UsersModel): Promise<UsersModel> {
    return Users.create(param);
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
    return Users.find(query)
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
