import { expect } from "chai";
import proxyquire from "proxyquire";
import mocha from "mocha";

// Mock the dependencies as 'any' objects
const AuthorsMock: any = {
  create: () => Promise.resolve({}),
  findById: () => Promise.resolve({}),
  updateOne: () => Promise.resolve({}),
  findByIdAndDelete: () => Promise.resolve({}),
  countDocuments: () => Promise.resolve(0),
  find: () => Promise.resolve([]),
};
const AuthorModelMock: any = {
  new: () => Promise.resolve({}),
  save: () => Promise.resolve({}),
};
const addLogMock: any = () => {};
const AuthorsSearchParamsMock: any = {
  name: "",
  bio: "",
  start_birth_date: null,
  end_birth_date: null,
  offset: 0,
  limit: 10,
  order: [],
};

// Inject the mocks using proxyquire
const { AuthorRepository } = proxyquire("../../src/repositories/author.repository", {
  "common": {
    Authors: AuthorsMock,
    AuthorModel: AuthorModelMock,
    addLog: addLogMock,
    AuthorsSearchParams: AuthorsSearchParamsMock,
    LogLevel: { info: "info", error: "error" },
  },
});

describe("AuthorRepository", () => {
  const repo = new AuthorRepository();

  it("should create author", async () => {
    const authorData = { name: "test", bio: "test bio" };
    const result = await repo.createAuthor(authorData as any);
    expect(result).to.be.an("object");
  });

  it("should get author by id", async () => {
    const id = "test-id";
    AuthorsMock.findById = () => Promise.resolve({ _id: id, name: "test-name" });
    const result = await repo.getAuthorById(id);
    expect(result).to.be.an("object");
  });

  it("should update author", async () => {
    const id = "test-id";
    const authorData = { name: "test-name" };
    AuthorsMock.updateOne = () => Promise.resolve({ n: 1, nModified: 1 });
    const result = await repo.updateAuthor(id, authorData);
    expect(result).to.be.an("object");
  });

  it("should delete author", async () => {
    const id = "test-id";
    AuthorsMock.findByIdAndDelete = () => Promise.resolve({ _id: id, name: "test-name" });
    const result = await repo.deleteAuthor(id);
    expect(result).to.be.an("object");
  });

  it("should search authors", async () => {
    const params = { name: "test-name" };
    AuthorsMock.countDocuments = () => Promise.resolve(1);
    AuthorsMock.find = () => Promise.resolve([{ name: "test-name", bio: "test-bio" }]);
    const result = await repo.searchAuthors(params);
    expect(result).to.be.an("object");
  });

  it("should get author count by name", async () => {
    const name = "test-name";
    const id = "test-id";
    AuthorsMock.countDocuments = () => Promise.resolve(1);
    const result = await repo.getAuthorByName(name, id);
    expect(result).to.be.a("number");
  });

  it("should get author count by name without id", async () => {
    const name = "test-name";
    AuthorsMock.countDocuments = () => Promise.resolve(1);
    const result = await repo.getAuthorByName(name);
    expect(result).to.be.a("number");
  });

  it("should throw error when create author fails", async () => {
    const authorData = { name: "test", bio: "test bio" };
    AuthorsMock.create = () => Promise.reject(new Error("Test error"));
    try {
      await repo.createAuthor(authorData as any);
      expect.fail("Expected an error to be thrown");
    } catch (error) {
      expect(error).to.be.an("error");
    }
  });

  it("should throw error when get author by id fails", async () => {
    const id = "test-id";
    AuthorsMock.findById = () => Promise.reject(new Error("Test error"));
    try {
      await repo.getAuthorById(id);
      expect.fail("Expected an error to be thrown");
    } catch (error) {
      expect(error).to.be.an("error");
    }
  });

  it("should throw error when update author fails", async () => {
    const id = "test-id";
    const authorData = { name: "test-name" };
    AuthorsMock.updateOne = () => Promise.reject(new Error("Test error"));
    try {
      await repo.updateAuthor(id, authorData);
      expect.fail("Expected an error to be thrown");
    } catch (error) {
      expect(error).to.be.an("error");
    }
  });

  it("should throw error when delete author fails", async () => {
    const id = "test-id";
    AuthorsMock.findByIdAndDelete = () => Promise.reject(new Error("Test error"));
    try {
      await repo.deleteAuthor(id);
      expect.fail("Expected an error to be thrown");
    } catch (error) {
      expect(error).to.be.an("error");
    }
  });

  it("should throw error when search authors fails", async () => {
    const params = { name: "test-name" };
    AuthorsMock.countDocuments = () => Promise.reject(new Error("Test error"));
    try {
      await repo.searchAuthors(params);
      expect.fail("Expected an error to be thrown");
    } catch (error) {
      expect(error).to.be.an("error");
    }
  });

  it("should throw error when get author count by name fails", async () => {
    const name = "test-name";
    AuthorsMock.countDocuments = () => Promise.reject(new Error("Test error"));
    try {
      await repo.getAuthorByName(name);
      expect.fail("Expected an error to be thrown");
    } catch (error) {
      expect(error).to.be.an("error");
    }
  });
});