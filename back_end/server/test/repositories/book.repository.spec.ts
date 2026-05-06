import "reflect-metadata";
import { expect } from "chai";
import { spy, stub } from "sinon";
import { BooksRepository } from "./book.repository";
import { BorrowRecordsModel, BooksModel, Categories, Authors, Users, UsersModel, BorrowRecords, Books } from "common";

describe("BooksRepository", () => {
  let booksRepository: BooksRepository;
  let authors: any;
  let books: any;
  let borrowRecords: any;
  let categories: any;
  let users: any;
  let usersModel: any;

  beforeEach(() => {
    authors = stub(Authors, "countDocuments");
    books = stub(Books, "countDocuments");
    borrowRecords = stub(BorrowRecords, "countDocuments");
    categories = stub(Categories, "countDocuments");
    users = stub(Users, "find");
    usersModel = stub(UsersModel, "find");
    booksRepository = new BooksRepository();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getBookByTitle", () => {
    it("should return the count of books with the given title", async () => {
      const title = "test-title";
      books.withArgs(title).resolves(1);
      const result = await booksRepository.getBookByTitle(title);
      expect(result).to.equal(1);
    });

    it("should return the count of books with the given title and id", async () => {
      const title = "test-title";
      const id = "test-id";
      books.withArgs(title, id).resolves(1);
      const result = await booksRepository.getBookByTitle(title, id);
      expect(result).to.equal(1);
    });

    it("should return 0 if no books with the given title are found", async () => {
      const title = "test-title";
      books.withArgs(title).resolves(0);
      const result = await booksRepository.getBookByTitle(title);
      expect(result).to.equal(0);
    });
  });

  describe("getAuthorById", () => {
    it("should return the count of authors with the given id", async () => {
      const id = "test-id";
      authors.withArgs(id).resolves(1);
      const result = await booksRepository.getAuthorById(id);
      expect(result).to.equal(1);
    });

    it("should return 0 if no authors with the given id are found", async () => {
      const id = "test-id";
      authors.withArgs(id).resolves(0);
      const result = await booksRepository.getAuthorById(id);
      expect(result).to.equal(0);
    });
  });

  describe("getCategoryById", () => {
    it("should return the count of categories with the given id", async () => {
      const id = "test-id";
      categories.withArgs(id).resolves(1);
      const result = await booksRepository.getCategoryById(id);
      expect(result).to.equal(1);
    });

    it("should return 0 if no categories with the given id are found", async () => {
      const id = "test-id";
      categories.withArgs(id).resolves(0);
      const result = await booksRepository.getCategoryById(id);
      expect(result).to.equal(0);
    });
  });

  describe("createBook", () => {
    it("should create a new book with the given data", async () => {
      const bookData = new BooksModel();
      books.withArgs(bookData).resolves(bookData);
      const result = await booksRepository.createBook(bookData);
      expect(result).to.deep.equal(bookData);
    });
  });

  describe("getBookById", () => {
    it("should return the book with the given id", async () => {
      const id = "test-id";
      books.findById.withArgs(id).resolves(new BooksModel());
      const result = await booksRepository.getBookById(id);
      expect(result).to.deep.equal(new BooksModel());
    });

    it("should return null if no book with the given id is found", async () => {
      const id = "test-id";
      books.findById.withArgs(id).resolves(null);
      const result = await booksRepository.getBookById(id);
      expect(result).to.be.null;
    });
  });

  describe("updateBook", () => {
    it("should update the book with the given id and data", async () => {
      const id = "test-id";
      const bookData = new BooksModel();
      books.findByIdAndUpdate.withArgs(id, bookData, { new: true }).resolves(bookData);
      const result = await booksRepository.updateBook(id, bookData);
      expect(result).to.deep.equal(bookData);
    });

    it("should return null if no book with the given id is found", async () => {
      const id = "test-id";
      books.findByIdAndUpdate.withArgs(id, {}, { new: true }).resolves(null);
      const result = await booksRepository.updateBook(id, new BooksModel());
      expect(result).to.be.null;
    });
  });

  describe("deleteBook", () => {
    it("should delete the book with the given id", async () => {
      const id = "test-id";
      books.findByIdAndDelete.withArgs(id).resolves(new BooksModel());
      const result = await booksRepository.deleteBook(id);
      expect(result).to.deep.equal(new BooksModel());
    });

    it("should return null if no book with the given id is found", async () => {
      const id = "test-id";
      books.findByIdAndDelete.withArgs(id).resolves(null);
      const result = await booksRepository.deleteBook(id);
      expect(result).to.be.null;
    });
  });

  describe("searchBooks", () => {
    it("should return the count and rows of books matching the given params", async () => {
      const params = { title: "test-title" };
      const count = 1;
      const rows = [new BooksModel()];
      books.countDocuments.withArgs({ title: { $regex: params.title, $options: "i" } }).resolves(count);
      books.find.withArgs({ title: { $regex: params.title, $options: "i" } }, null, { populate: true, sort: true }).resolves(rows);
      const result = await booksRepository.searchBooks(params);
      expect(result).to.deep.equal({ count, rows });
    });

    it("should return the count and rows of books matching the given params with author and category", async () => {
      const params = { title: "test-title", author: "test-author", category: "test-category" };
      const count = 1;
      const rows = [new BooksModel()];
      books.countDocuments.withArgs({ title: { $regex: params.title, $options: "i" }, author: { $regex: params.author, $options: "i" }, category: { $regex: params.category, $options: "i" } }).resolves(count);
      books.find.withArgs({ title: { $regex: params.title, $options: "i" }, author: { $regex: params.author, $options: "i" }, category: { $regex: params.category, $options: "i" } }, null, { populate: true, sort: true }).resolves(rows);
      const result = await booksRepository.searchBooks(params);
      expect(result).to.deep.equal({ count, rows });
    });

    it("should return the count and rows of books matching the given params with publisher", async () => {
      const params = { title: "test-title", publisher: "test-publisher" };
      const count = 1;
      const rows = [new BooksModel()];
      books.countDocuments.withArgs({ title: { $regex: params.title, $options: "i" }, publisher: { $regex: params.publisher, $options: "i" } }).resolves(count);
      books.find.withArgs({ title: { $regex: params.title, $options: "i" }, publisher: { $regex: params.publisher, $options: "i" } }, null, { populate: true, sort: true }).resolves(rows);
      const result = await booksRepository.searchBooks(params);
      expect(result).to.deep.equal({ count, rows });
    });

    it("should return the count and rows of books matching the given params with order", async () => {
      const params = { title: "test-title", order: [["createdAt", "desc"]] };
      const count = 1;
      const rows = [new BooksModel()];
      books.countDocuments.withArgs({ title: { $regex: params.title, $options: "i" } }).resolves(count);
      books.find.withArgs({ title: { $regex: params.title, $options: "i" } }, null, { populate: true, sort: params.order }).resolves(rows);
      const result = await booksRepository.searchBooks(params);
      expect(result).to.deep.equal({ count, rows });
    });
  });

  describe("getUsersByIds", () => {
    it("should return the users with the given ids", async () => {
      const ids = ["test-id1", "test-id2"];
      const usersRows = [new UsersModel(), new UsersModel()];
      users.withArgs({ _id: { $in: ids } }).resolves(usersRows);
      const result = await booksRepository.getUsersByIds(ids);
      expect(result).to.deep.equal(usersRows);
    });
  });

  describe("createBorrowRecords", () => {
    it("should create a new borrow record with the given model", async () => {
      const model = new BorrowRecordsModel();
      borrowRecords.create.withArgs(model).resolves(model);
      const result = await booksRepository.createBorrowRecords(model);
      expect(result).to.deep.equal(model);
    });
  });
});