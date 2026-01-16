import { UpdateResult } from "mongoose";
<<<<<<< HEAD:back_end/src/repositories/book.repository.ts
import Books, { BooksModel } from "../../common/database/models/books";
import { UsersModel, Users } from "../../common/database/models/users";
import BorrowRecords, {
=======
import {
>>>>>>> 74355e3e0d8474fbefe72dfaf8d3a107a1bc230d:back_end/lambda/src/repositories/book.repository.ts
  BorrowRecordsModel,
  Authors,
  Categories,
  BooksModel,
  Books,
  Users,
  UsersModel,
  BorrowRecords,
} from "common";

export class BooksRepository {
  public async getBookByTitle(title: string, id?: string): Promise<number> {
    if (id) return Books.countDocuments({ title, _id: { $ne: id } });
    return Books.countDocuments({ title });
  }

  public async getAuthorById(id: string): Promise<number> {
    return Authors.countDocuments({ _id: id });
  }

  public async getCategoryById(id: string): Promise<number> {
    return Categories.countDocuments({ _id: id });
  }

  public async createBook(bookData: BooksModel): Promise<BooksModel | any> {
    return Books.create(bookData);
  }

  public async getBookById(id: string): Promise<BooksModel | null> {
    return Books.findById({ _id: id });
  }

  public async updateBook(
    id: string,
    bookData: BooksModel
  ): Promise<UpdateResult> {
    return Books.updateOne({ _id: id }, bookData);
  }

  public async deleteBook(id: string): Promise<BooksModel | null> {
    return Books.findByIdAndDelete({ _id: id });
  }
  public async searchBooks(params: any): Promise<BooksModel[]> {
    let query = {};
    if (params.title) {
      query = { ...query, title: { $regex: params.title, $options: "i" } };
    }
    if (params.author) {
      query = { ...query, author: { $regex: params.author, $options: "i" } };
    }
    if (params.category) {
      query = {
        ...query,
        category: { $regex: params.category, $options: "i" },
      };
    }

    if (params.publisher) {
      query = {
        ...query,
        publisher: { $regex: params.publisher, $options: "i" },
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

    return Books.find(query)
      .populate("author", "name")
      .populate("category", "name")
      .sort(order)
      .skip(params.offset || 0)
      .limit(params.limit || 10);
  }

  public async getUsersByIds(ids: string[]): Promise<UsersModel[]> {
    return Users.find({ _id: { $in: ids } }).populate("role", "name");
  }

  public async createBorrowRecords(
    model: BorrowRecordsModel
  ): Promise<BorrowRecordsModel> {
    return BorrowRecords.create(model);
  }
}
