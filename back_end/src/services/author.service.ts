import { UpdateResult } from "mongoose";
import { AuthorModel } from "../../common/database/models/author";
import { ErrorType } from "../../common/enum";
import { AuthorsSearchParams } from "../interface/common.interface";
import { AuthorRepository } from "../repositories/author.repository";

export class AuthorService {
  constructor(private readonly authorRepository: AuthorRepository) {
    this.authorRepository = authorRepository;
  }

  public async searchAuthors(
    param: AuthorsSearchParams
  ): Promise<AuthorModel[]> {
    return this.authorRepository.searchAuthors(param);
  }

  public async getAuthorById(id: string): Promise<AuthorModel | null> {
    return this.authorRepository.getAuthorById(id);
  }

  public async createAuthor(authorData: AuthorModel): Promise<AuthorModel> {
    const existingAuthor = await this.authorRepository.getAuthorByName(
      authorData.name
    );
    if (existingAuthor > 0) {
      const err = new Error();
      err.name = ErrorType.AuthorIsUnique;
      return Promise.reject(err);
    }
    return this.authorRepository.createAuthor(authorData);
  }

  public async updateAuthor(
    id: string,
    authorData: AuthorModel
  ): Promise<UpdateResult> {
    const existingAuthor = await this.authorRepository.getAuthorById(id);
    if (!existingAuthor) {
      const err = new Error();
      err.name = ErrorType.AuthorNotFound;
      return Promise.reject(err);
    }
    const existingAuthorName = await this.authorRepository.getAuthorByName(
      authorData.name,
      id
    );
    if (existingAuthorName && existingAuthorName > 0) {
      const err = new Error();
      err.name = ErrorType.AuthorIsUnique;
      return Promise.reject(err);
    }
    return this.authorRepository.updateAuthor(id, authorData);
  }

  public async deleteAuthor(id: string): Promise<AuthorModel | null> {
    const existingAuthor = await  this.authorRepository.deleteAuthor(id);
    if (!existingAuthor) {
      const err = new Error();
      err.name = ErrorType.AuthorNotFound;
      return Promise.reject(err);
    }
    return existingAuthor;
  }
}
