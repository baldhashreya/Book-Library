import BorrowRecords from "../../common/database/models/borrow-records";
import Users, { UsersModel } from "../../common/database/models/users";
import { UsersSearchParams } from "../interface/common.interface";

export class UsersRepository {
  public async createUsers(param: UsersModel[]): Promise<void> {
    await Users.insertMany(param);
  }

  public async deleteUser(id: string): Promise<UsersModel | null> {
    return Users.findByIdAndDelete({ _id: id });
  }

  public async searchUsers(
    params: UsersSearchParams
  ): Promise<{ rows: UsersModel[]; count: number }> {
    let sort: any = {};

    if (params.order && params.order.length && params.order[0]?.length) {
      const field = params.order[0][0] as string;
      const direction = params.order[0][1]?.toLowerCase() === "asc" ? 1 : -1;

      if (field === "username") {
        sort = { firstName: direction };
      } else if (field === "role") {
        sort = { "roleData.name": direction };
      } else {
        sort = { [field]: direction };
      }
    } else {
      sort = { createdAt: -1 };
    }

    const offset = params.offset || 0;
    const limit = params.limit || 10;

    const result = await Users.aggregate([
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "roleData",
        },
      },
      { $unwind: { path: "$roleData", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          fullName: {
            $trim: {
              input: {
                $concat: [
                  { $ifNull: ["$firstName", ""] },
                  " ",
                  { $ifNull: ["$lastName", ""] },
                ],
              },
            },
          },
        },
      },
      { $sort: sort },
      { $skip: offset },
      { $limit: limit },
      {
        $project: {
          userName: 1,
          firstName: 1,
          lastName: 1,
          publisher: 1,
          email: 1,
          status: 1,
          role: "$roleData.name",
        },
      },
    ]);

    const count = await Users.countDocuments(); // total users
    const rows = result;

    return { rows, count };
  }

  public async getUserByEmail(email: string, id?: string): Promise<number> {
    if (id) {
      return Users.countDocuments({ email, _id: { $ne: id } });
    }
    return Users.countDocuments({ email });
  }

  public async getUserBorrowHistory(id: string) {
    return BorrowRecords.find({ issuedBy: id }).populate("bookId", "title");
  }
}
