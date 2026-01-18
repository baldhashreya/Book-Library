import { Request, Response } from "express";
import { AuthorService } from "../services/author.service";
import { baseController, AuthorOperations, HttpStatusCode } from "common";

export class AuthorController {
  constructor(private readonly authorService: AuthorService) {
    this.authorService = authorService;
  }

  public searchAuthors = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const authors = await this.authorService.searchAuthors(req.body);
    return baseController.getResult(
      res,
      HttpStatusCode.Ok,
      authors,
      AuthorOperations.SEARCH
    );
  };

  public getAuthorById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const author = await this.authorService.getAuthorById(
      req.params.id as string
    );
    return baseController.getResult(
      res,
      HttpStatusCode.Ok,
      author,
      AuthorOperations.SEARCH
    );
  };
  public createAuthor = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const newAuthor = await this.authorService.createAuthor(req.body);
    return baseController.getResult(
      res,
      HttpStatusCode.Ok,
      newAuthor,
      AuthorOperations.CREATE
    );
  };

  public updateAuthor = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const updatedAuthor = await this.authorService.updateAuthor(
      req.params.id as string,
      req.body
    );
    return baseController.getResult(
      res,
      HttpStatusCode.Ok,
      updatedAuthor,
      AuthorOperations.UPDATED
    );
  };

  public deleteAuthor = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const deletedAuthor = await this.authorService.deleteAuthor(
      req.params.id as string
    );
    return baseController.getResult(
      res,
      HttpStatusCode.Ok,
      deletedAuthor,
      AuthorOperations.DELETED
    );
  };
}
