import { BooksModel } from "../../common/database/models/books";
import { BorrowRecordsModel } from "../../common/database/models/borrow-records";
import { BorrowRecordsEnum, ErrorType } from "../../common/enum";
import { AssignBook } from "../interface/common.interface";
import { BooksRepository } from "../repositories/book.repository";

export class BooksService {
  constructor(private readonly booksRepository: BooksRepository) {
    this.booksRepository = booksRepository;
  }

  public async getBookByTitle(title: string) {
    return this.booksRepository.getBookByTitle(title);
  }

  public async createBook(bookData: BooksModel) {
    await this.validateBook(bookData);
    return this.booksRepository.createBook(bookData);
  }

  public async getBookById(id: string) {
    return this.booksRepository.getBookById(id);
  }

  public async updateBook(id: string, bookData: BooksModel) {
    await this.validateBook(bookData, id);
    return this.booksRepository.updateBook(id, bookData);
  }

  public async deleteBook(id: string) {
    return this.booksRepository.deleteBook(id);
  }

  private async validateBook(bookData: BooksModel, id?: string) {
    if (id) {
      const existingBook = await this.booksRepository.getBookById(id);
      if (!existingBook) {
        const err = new Error();
        err.name = ErrorType.BookNotFound;
        return Promise.reject(err);
      }
    }

    const existingBook = await this.booksRepository.getBookByTitle(
      bookData.title,
      id
    );

    if (existingBook > 0) {
      const err = new Error();
      err.name = ErrorType.BookIsUnique;
      return Promise.reject(err);
    }

    const authorExist = await this.booksRepository.getAuthorById(
      bookData.author as string
    );

    if (!authorExist) {
      const err = new Error();
      err.name = ErrorType.AuthorNotFound;
      return Promise.reject(err);
    }

    const categoryExist = await this.booksRepository.getCategoryById(
      bookData.category as string
    );
    if (!categoryExist) {
      const err = new Error();
      err.name = ErrorType.CategoryNotFound;
      return Promise.reject(err);
    }

    return true;
  }

  public async searchBooks(params: any) {
    return this.booksRepository.searchBooks(params);
  }

  public async assignBookToUser(params: AssignBook, currentUser: string) {
    try {
      const UsersModel = await this.booksRepository.getUsersByIds([
        currentUser,
        params.userId,
      ]);
      if (UsersModel.length <= 0) {
        const err = new Error();
        err.name = ErrorType.UserNotFound;
        return Promise.reject(err);
      }

      const CurrentUserModel = UsersModel.find((e) => {
        return e._id === currentUser;
      });

      // determine role name whether role is a populated object or a raw id/string
      const currentUserRoleName =
        CurrentUserModel &&
        (typeof (CurrentUserModel.role as any) === "object" &&
        (CurrentUserModel.role as any)?.name
          ? (CurrentUserModel.role as any).name
          : (CurrentUserModel.role as any)?.toString());

      if (CurrentUserModel && currentUserRoleName === "Member") {
        const err = new Error();
        err.name = ErrorType.NotAbleAssignBook;
        return Promise.reject(err);
      }

      const BookModel = await this.booksRepository.getBookById(params.bookId);

      if (!BookModel) {
        const err = new Error();
        err.name = ErrorType.BookNotFound;
        return Promise.reject(err);
      }

      if (BookModel.issuedBook >= BookModel.quantity) {
        const err = new Error();
        err.name = ErrorType.BookIsOutOfStock;
        return Promise.reject(err);
      }

      const borrowRecords = {
        bookId: params.bookId,
        issuedBy: params.userId,
        issueDate: new Date(),
        returnDate: params.returnDate,
        status: BorrowRecordsEnum.ISSUED,
      } as BorrowRecordsModel;
      await this.booksRepository.createBorrowRecords(borrowRecords);

      await this.booksRepository.updateBook(params.bookId, {
        issuedBook: (BookModel.issuedBook ? BookModel.issuedBook : 0) + 1,
      } as BooksModel);
    } catch (err) {
      console.log(err);
    }
  }
}
