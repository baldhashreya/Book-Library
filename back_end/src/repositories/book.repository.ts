import { UpdateResult } from "mongoose";
import Books, { BooksModel } from "../../common/database/models/books";
import Users, { UsersModel } from "../../common/database/models/users";
import BorrowRecords, {
  BorrowRecordsModel,
} from "../../common/database/models/borrow-records";
import Categories from "../../common/database/models/categories";
import Authors from "../../common/database/models/author";

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
  public async searchBooks(
    params: any
  ): Promise<{ count: number; rows: BooksModel[] } | any> {
    try {
      let sort: any = {};
      if (params.order && params.order[0]?.length) {
        const field = params.order[0][0];
        const dir = params.order[0][1]?.toLowerCase() === "asc" ? 1 : -1;

        if (field === "author") {
          sort = { "authorData.name": dir };
        } else if (field === "category") {
          sort = { "categoryData.name": dir };
        } else {
          sort = { [field]: dir };
        }
      } else {
        sort = { createdAt: -1 };
      }
      const pipeline: any[] = [
        // { $match: match },
        {
          $lookup: {
            from: "authors",
            localField: "author",
            foreignField: "_id",
            as: "authorData",
          },
        },
        { $unwind: "$authorData" },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryData",
          },
        },
        { $unwind: "$categoryData" },
        { $sort: sort },
        { $skip: params.offset || 0 },
        { $limit: params.limit || 10 },
        {
          $project: {
            title: 1,
            publisher: 1,
            createdAt: 1,
            author: "$authorData.name",
            category: "$categoryData.name",
            quantity: 1,
            issuedBook: 1,
          },
        },
      ];
      const count = await Books.countDocuments();
      const rows = await Books.aggregate(pipeline);

      return { count, rows };
    } catch (err) {
      console.error(err);
    }
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
