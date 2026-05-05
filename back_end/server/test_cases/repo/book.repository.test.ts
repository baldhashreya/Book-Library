import { expect } from "chai";
import proxyquire from "proxyquire";

const BooksMock: any = {
  countDocuments: () => Promise.resolve(0),
  create: () => Promise.resolve({}),
  findById: () => Promise.resolve(null),
  findByIdAndUpdate: () => Promise.resolve({}),
  findByIdAndDelete: () => Promise.resolve(null),
  find: () => Promise.resolve([]),
  populate: () => Promise.resolve([]),
  sort: () => Promise.resolve([]),
  skip: () => Promise.resolve([]),
  limit: () => Promise.resolve([]),
};

const AuthorsMock: any = {
  countDocuments: () => Promise.resolve(0),
};

const CategoriesMock: any = {
  countDocuments: () => Promise.resolve(0),
};

const BorrowRecordsMock: any = {
  create: () => Promise.resolve({}),
};

const UsersMock: any = {
  find: () => Promise.resolve([]),
  populate: () => Promise.resolve([]),
};

const UsersModelMock: any = {
  find: () => Promise.resolve([]),
  populate: () => Promise.resolve([]),
};

const BorrowRecordsModelMock: any = {
  create: () => Promise.resolve({}),
};

const { BooksRepository } = proxyquire("../../src/repositories/books.repository", {
  "common": {
    Books: BooksMock,
    Authors: AuthorsMock,
    Categories: CategoriesMock,
    BorrowRecords: BorrowRecordsMock,
    Users: UsersMock,
    UsersModel: UsersModelMock,
    BorrowRecordsModel: BorrowRecordsModelMock,
  },
});

describe("BooksRepository", () => {
  const repo = new BooksRepository();
  it("should work", async () => {
    const result = await repo.getBookByTitle("Test Title", "Test Id");
    expect(result).to.be.a("number");
  });

  it("should work with id", async () => {
    const result = await repo.getBookByTitle("Test Title", "Test Id");
    expect(result).to.be.a("number");
  });

  it("should work getAuthorById", async () => {
    const result = await repo.getAuthorById("Test Id");
    expect(result).to.be.a("number");
  });

  it("should work getCategoryById", async () => {
    const result = await repo.getCategoryById("Test Id");
    expect(result).to.be.a("number");
  });

  it("should work createBook", async () => {
    const bookData = { title: "Test Title", author: "Test Author" };
    const result = await repo.createBook(bookData);
    expect(result).to.be.an("object");
  });

  it("should work getBookById", async () => {
    const result = await repo.getBookById("Test Id");
    expect(result).to.be.an("object");
  });

  it("should work updateBook", async () => {
    const bookData = { title: "Test Title", author: "Test Author" };
    const result = await repo.updateBook("Test Id", bookData);
    expect(result).to.be.an("object");
  });

  it("should work deleteBook", async () => {
    await repo.deleteBook("Test Id");
  });

  it("should work searchBooks", async () => {
    const params = { title: "Test Title" };
    const result = await repo.searchBooks(params);
    expect(result).to.be.an("object");
  });

  it("should work searchBooks with offset", async () => {
    const params = { title: "Test Title", offset: 10 };
    const result = await repo.searchBooks(params);
    expect(result).to.be.an("object");
  });

  it("should work searchBooks with limit", async () => {
    const params = { title: "Test Title", limit: 10 };
    const result = await repo.searchBooks(params);
    expect(result).to.be.an("object");
  });

  it("should work searchBooks with order", async () => {
    const params = { title: "Test Title", order: [["createdAt", "desc"]] };
    const result = await repo.searchBooks(params);
    expect(result).to.be.an("object");
  });

  it("should work getUsersByIds", async () => {
    const ids = ["Test Id"];
    const result = await repo.getUsersByIds(ids);
    expect(result).to.be.an("array");
  });

  it("should work createBorrowRecords", async () => {
    const model = { title: "Test Title", author: "Test Author" };
    const result = await repo.createBorrowRecords(model);
    expect(result).to.be.an("object");
  });
});