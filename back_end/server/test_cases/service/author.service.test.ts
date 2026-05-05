import { expect } from "chai";
import proxyquire from "proxyquire";
import { ErrorType } from "common";
import { UpdateResult } from "mongoose";
import { AuthorsSearchParams } from "../interface/common.interface";
import { AuthorModel } from "../models/author.model";
import { AuthorRepository } from "../repositories/author.repository";

const Mock: any = {
  common: {
    ErrorType,
  },
  mongoose: {
    UpdateResult,
  },
  "../repositories/author.repository": {
    searchAuthors: (param: AuthorsSearchParams) => {
      return Promise.resolve({ count: 10, rows: [] });
    },
    getAuthorById: (id: string) => {
      return Promise.resolve({ _id: id, name: "John Doe" });
    },
    getAuthorByName: (name: string, id?: string) => {
      return Promise.resolve(id ? 1 : 0);
    },
    createAuthor: (authorData: AuthorModel) => {
      return Promise.resolve(authorData);
    },
    updateAuthor: (id: string, authorData: AuthorModel) => {
      return Promise.resolve({ modifiedCount: 1, upsertedId: null, upsertedCount: 0 });
    },
    deleteAuthor: (id: string) => {
      return Promise.resolve({ _id: id, name: "John Doe" });
    },
  },
};

describe("AuthorService", () => {
  let authorService: AuthorService;

  beforeEach(() => {
    authorService = new AuthorService(Mock["../repositories/author.repository"]);
  });

  afterEach(() => {
    // reset mocked dependencies
    Mock["../repositories/author.repository"] = {
      searchAuthors: (param: AuthorsSearchParams) => {
        return Promise.resolve({ count: 10, rows: [] });
      },
      getAuthorById: (id: string) => {
        return Promise.resolve({ _id: id, name: "John Doe" });
      },
      getAuthorByName: (name: string, id?: string) => {
        return Promise.resolve(id ? 1 : 0);
      },
      createAuthor: (authorData: AuthorModel) => {
        return Promise.resolve(authorData);
      },
      updateAuthor: (id: string, authorData: AuthorModel) => {
        return Promise.resolve({ modifiedCount: 1, upsertedId: null, upsertedCount: 0 });
      },
      deleteAuthor: (id: string) => {
        return Promise.resolve({ _id: id, name: "John Doe" });
      },
    };
  });

  describe("searchAuthors", () => {
    it("should return authors with count and rows", async () => {
      const param: AuthorsSearchParams = {
        limit: 10,
        offset: 0,
      };
      const result = await authorService.searchAuthors(param);
      expect(result).to.be.an("object");
      expect(result).to.have.property("count");
      expect(result).to.have.property("rows");
      expect(result.rows).to.be.an("array");
    });
  });

  describe("getAuthorById", () => {
    it("should return author by id", async () => {
      const id = "1234567890";
      const result = await authorService.getAuthorById(id);
      expect(result).to.be.an("object");
      expect(result).to.have.property("_id");
      expect(result._id).to.equal(id);
    });
  });

  describe("createAuthor", () => {
    it("should create author", async () => {
      const authorData: AuthorModel = {
        name: "John Doe",
      };
      const result = await authorService.createAuthor(authorData);
      expect(result).to.be.an("object");
      expect(result).to.have.property("name");
      expect(result.name).to.equal(authorData.name);
    });

    it("should return error if author exists", async () => {
      const authorData: AuthorModel = {
        name: "John Doe",
      };
      Mock["../repositories/author.repository"].getAuthorByName = (name: string, id?: string) => {
        return Promise.resolve(1);
      };
      try {
        await authorService.createAuthor(authorData);
        expect.fail("Expected error to be thrown");
      } catch (error: any) {
        expect(error.name).to.equal(ErrorType.AuthorIsUnique);
      }
    });
  });

  describe("updateAuthor", () => {
    it("should update author", async () => {
      const id = "1234567890";
      const authorData: AuthorModel = {
        name: "Jane Doe",
      };
      const result = await authorService.updateAuthor(id, authorData);
      expect(result).to.be.an("object");
      expect(result).to.have.property("modifiedCount");
      expect(result.modifiedCount).to.equal(1);
    });

    it("should return error if author not found", async () => {
      const id = "1234567890";
      const authorData: AuthorModel = {
        name: "Jane Doe",
      };
      Mock["../repositories/author.repository"].getAuthorById = (id: string) => {
        return Promise.resolve(null);
      };
      try {
        await authorService.updateAuthor(id, authorData);
        expect.fail("Expected error to be thrown");
      } catch (error: any) {
        expect(error.name).to.equal(ErrorType.AuthorNotFound);
      }
    });

    it("should return error if author exists", async () => {
      const id = "1234567890";
      const authorData: AuthorModel = {
        name: "Jane Doe",
      };
      Mock["../repositories/author.repository"].getAuthorByName = (name: string, id?: string) => {
        return Promise.resolve(1);
      };
      try {
        await authorService.updateAuthor(id, authorData);
        expect.fail("Expected error to be thrown");
      } catch (error: any) {
        expect(error.name).to.equal(ErrorType.AuthorIsUnique);
      }
    });
  });

  describe("deleteAuthor", () => {
    it("should delete author", async () => {
      const id = "1234567890";
      const result = await authorService.deleteAuthor(id);
      expect(result).to.be.an("object");
      expect(result).to.have.property("_id");
      expect(result._id).to.equal(id);
    });

    it("should return error if author not found", async () => {
      const id = "1234567890";
      Mock["../repositories/author.repository"].deleteAuthor = (id: string) => {
        return Promise.resolve(null);
      };
      try {
        await authorService.deleteAuthor(id);
        expect.fail("Expected error to be thrown");
      } catch (error: any) {
        expect(error.name).to.equal(ErrorType.AuthorNotFound);
      }
    });
  });
});
```

This test suite covers all the methods of the `AuthorService` class and includes various scenarios to test the behavior of each method. The mocked dependencies are reset after each test to ensure that the tests are isolated and do not interfere with each other.