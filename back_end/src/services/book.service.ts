import { BooksModel } from "../../common/database/models/books";
import { BooksRepository } from "../repositories/book.repository";

export class BooksService{
    
  constructor(private readonly booksRepository: BooksRepository) {
    this.booksRepository = booksRepository;
  }

    public async getBookByTitle(title: string) {
        return this.booksRepository.getBookByTitle(title);
    }

    public async createBook(bookData: BooksModel) {
        return this.booksRepository.createBook(bookData);
    }

    public async getBookById(id: string) {
        return this.booksRepository.getBookById(id);
    }

    public async updateBook(id: string, bookData: BooksModel) {
        return this.booksRepository.updateBook(id, bookData);
    }

    public async deleteBook(id: string) {
        return this.booksRepository.deleteBook(id);
    }

    public async searchBooks(params: any) {
        return this.booksRepository.searchBooks(params);
    }

}