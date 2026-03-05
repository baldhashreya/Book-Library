import { UpdateResult } from "mongoose";
import { addLog, AuthorModel, Authors, LogLevel } from "common";
import { AuthorsSearchParams } from "../interface/common.interface";

export class AuthorRepository {
  public async createAuthor(authorData: AuthorModel): Promise<AuthorModel> {
    return Authors.create(authorData);
  }

  public async getAuthorById(id: string): Promise<AuthorModel | null> {
    return Authors.findById({ _id: id });
  }

  public async updateAuthor(
    id: string,
    authorData: AuthorModel,
  ): Promise<UpdateResult> {
    return Authors.updateOne({ _id: id }, authorData);
  }

  public async deleteAuthor(id: string): Promise<AuthorModel | null> {
    return Authors.findByIdAndDelete({ _id: id });
  }

  public async searchAuthors(
    params: AuthorsSearchParams,
  ): Promise<{ count: number; rows: AuthorModel[] }> {
    addLog(LogLevel.info, "searchAuthors", params);
    let query = {};
    if (params.name) {
      query = { ...query, name: { $regex: params.name, $options: "i" } };
    }

    if (params.bio) {
      query = { ...query, bio: { $regex: params.bio, $options: "i" } };
    }

    if (params.start_birth_date) {
      query = { ...query, birthDate: { $gte: params.start_birth_date } };
    }

    if (params.end_birth_date) {
      query = { ...query, birthDate: { $lte: params.end_birth_date } };
    }
    let order = {};
    if (params.order && params.order.length && params.order[0]?.length) {
      let orderDirection = params.order[0][1] ? params.order[0][1] : "desc";
      let direction = orderDirection.toLowerCase() === "asc" ? 1 : -1;
      order = { [String(params.order[0][0])]: direction };
    } else {
      order = { createdAt: -1 };
    }

    const count = await Authors.countDocuments(query);

    const rows = await Authors.find(query)
      .sort(order)
      .skip(params.offset || 0)
      .limit(params.limit || 10);

    return { count, rows };
  }

  public async getAuthorByName(name: string, id?: string): Promise<number> {
    if (id) {
      return Authors.countDocuments({ name, _id: { $ne: id } });
    }
    return Authors.countDocuments({ name });
  }
}
