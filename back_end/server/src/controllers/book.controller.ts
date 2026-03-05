import { Request, Response } from "express";
import { BooksService } from "../services/book.service";
import {
  BooksOperations,
  HttpStatusCode,
  LogLevel,
  baseController,
  addLog,
} from "common";
import { AssignBook } from "../interface/common.interface";

export class BookController {
  constructor(private readonly booksService: BooksService) {
    this.booksService = booksService;
  }

  public createBook = async (req: Request, res: Response) => {
    addLog(LogLevel.info, "create Book", req.body);
    const newBook = await this.booksService.createBook(req.body);
    return baseController.getResult(
      res,
      HttpStatusCode.Ok,
      newBook,
      BooksOperations.CREATE
    );
  };

  public updateBook = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    addLog(LogLevel.info, "update Book", req.body);
    const updatedBook = await this.booksService.updateBook(
      req.params.id as string,
      req.body
    );
    return baseController.getResult(
      res,
      HttpStatusCode.Ok,
      updatedBook,
      BooksOperations.UPDATED
    );
  };

  public searchBooks = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    addLog(LogLevel.info, "search Book", req.body);
    const books = await this.booksService.searchBooks(req.body);
    return baseController.getResult(
      res,
      HttpStatusCode.Ok,
      books,
      BooksOperations.SEARCH
    );
  };

  public deleteBook = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    addLog(LogLevel.info, "delete Book", req.body);
    const deletedBook = await this.booksService.deleteBook(
      req.params.id as string
    );
    return baseController.getResult(
      res,
      HttpStatusCode.Ok,
      deletedBook,
      BooksOperations.DELETED
    );
  };

  public getBookById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    addLog(LogLevel.info, "get Book", req.body);
    const book = await this.booksService.getBookById(req.params.id as string);
    return baseController.getResult(
      res,
      HttpStatusCode.Ok,
      book,
      BooksOperations.SEARCH
    );
  };

  public assignBook = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    addLog(LogLevel.info, "Assign Book", req.body);

    const book = await this.booksService.assignBookToUser(
      { ...req.body, bookId: req.params.id } as AssignBook,
      (req as any).userId as string
    );
    return baseController.getResult(
      res,
      HttpStatusCode.Ok,
      book,
      BooksOperations.ASSIGN_BOOK
    );
  };
}
