import "reflect-metadata";
import { expect } from "chai";
import { sinon } from "sinon";
import { Mongoose } from "mongoose";
import { UpdateResult } from "mongoose";
import { addLog } from "common";
import { Authors, AuthorModel } from "common";
import { AuthorRepository } from "./author.repository";
import { AuthorsSearchParams } from "../interface/common.interface";

describe("AuthorRepository", () => {
  let authorRepository: AuthorRepository;
  let stubAuthors: sinon.SinonStubbedInstance<typeof Authors>;
  let stubAddLog: sinon.SinonStubbedInstance<typeof addLog>;

  beforeEach(() => {
    const mongooseStub = sinon.createStubInstance(Mongoose);
    stubAuthors = sinon.createStubInstance(Authors);
    stubAddLog = sinon.createStubInstance(addLog);
    authorRepository = new AuthorRepository();
    sinon.replace(Authors, "create", stubAuthors.create);
    sinon.replace(Authors, "findById", stubAuthors.findById);
    sinon.replace(Authors, "updateOne", stubAuthors.updateOne);
    sinon.replace(Authors, "findByIdAndDelete", stubAuthors.findByIdAndDelete);
    sinon.replace(Authors, "countDocuments", stubAuthors.countDocuments);
    sinon.replace(Authors, "find", stubAuthors.find);
    sinon.replace(addLog, "info", stubAddLog.info);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createAuthor", () => {
    it("should create a new author", async () => {
      const authorData: AuthorModel = { name: "John Doe", bio: "Author bio" };
      const result: AuthorModel = { name: "John Doe", bio: "Author bio" };
      stubAuthors.create.resolves(result);
      const createdAuthor = await authorRepository.createAuthor(authorData);
      expect(createdAuthor).to.deep.equal(result);
    });

    it("should throw an error if create fails", async () => {
      const authorData: AuthorModel = { name: "John Doe", bio: "Author bio" };
      const error = new Error("Create author failed");
      stubAuthors.create.rejects(error);
      await expect(authorRepository.createAuthor(authorData)).to.be.rejectedWith(
        error
      );
    });
  });

  describe("getAuthorById", () => {
    it("should return the author by id", async () => {
      const authorData: AuthorModel = { name: "John Doe", bio: "Author bio" };
      const result: AuthorModel = { name: "John Doe", bio: "Author bio" };
      stubAuthors.findById.resolves(result);
      const author = await authorRepository.getAuthorById("1234567890");
      expect(author).to.deep.equal(result);
    });

    it("should return null if author not found", async () => {
      stubAuthors.findById.resolves(null);
      const author = await authorRepository.getAuthorById("1234567890");
      expect(author).to.be.null;
    });
  });

  describe("updateAuthor", () => {
    it("should update the author", async () => {
      const authorData: AuthorModel = { name: "John Doe", bio: "Author bio" };
      const result: UpdateResult = { nModified: 1, n: 1, ok: 1 };
      stubAuthors.updateOne.resolves(result);
      const updatedAuthor = await authorRepository.updateAuthor(
        "1234567890",
        authorData
      );
      expect(updatedAuthor).to.deep.equal(result);
    });

    it("should throw an error if update fails", async () => {
      const authorData: AuthorModel = { name: "John Doe", bio: "Author bio" };
      const error = new Error("Update author failed");
      stubAuthors.updateOne.rejects(error);
      await expect(
        authorRepository.updateAuthor("1234567890", authorData)
      ).to.be.rejectedWith(error);
    });
  });

  describe("deleteAuthor", () => {
    it("should delete the author", async () => {
      const authorData: AuthorModel = { name: "John Doe", bio: "Author bio" };
      const result: AuthorModel = { name: "John Doe", bio: "Author bio" };
      stubAuthors.findByIdAndDelete.resolves(result);
      const deletedAuthor = await authorRepository.deleteAuthor("1234567890");
      expect(deletedAuthor).to.deep.equal(result);
    });

    it("should return null if author not found", async () => {
      stubAuthors.findByIdAndDelete.resolves(null);
      const deletedAuthor = await authorRepository.deleteAuthor("1234567890");
      expect(deletedAuthor).to.be.null;
    });
  });

  describe("searchAuthors", () => {
    it("should search authors by name, bio, birth date, and order", async () => {
      const params: AuthorsSearchParams = {
        name: "John",
        bio: "Author bio",
        start_birth_date: "1990-01-01",
        end_birth_date: "1990-12-31",
        order: [["name", "asc"]],
      };
      const result = {
        count: 1,
        rows: [{ name: "John Doe", bio: "Author bio", birthDate: "1990-01-01" }],
      };
      stubAuthors.countDocuments.resolves(result.count);
      stubAuthors.find.resolves(result.rows);
      const searchedAuthors = await authorRepository.searchAuthors(params);
      expect(searchedAuthors).to.deep.equal(result);
    });

    it("should search authors by name only", async () => {
      const params: AuthorsSearchParams = {
        name: "John",
      };
      const result = {
        count: 1,
        rows: [{ name: "John Doe", bio: "Author bio" }],
      };
      stubAuthors.countDocuments.resolves(result.count);
      stubAuthors.find.resolves(result.rows);
      const searchedAuthors = await authorRepository.searchAuthors(params);
      expect(searchedAuthors).to.deep.equal(result);
    });

    it("should search authors by bio only", async () => {
      const params: AuthorsSearchParams = {
        bio: "Author bio",
      };
      const result = {
        count: 1,
        rows: [{ name: "John Doe", bio: "Author bio" }],
      };
      stubAuthors.countDocuments.resolves(result.count);
      stubAuthors.find.resolves(result.rows);
      const searchedAuthors = await authorRepository.searchAuthors(params);
      expect(searchedAuthors).to.deep.equal(result);
    });

    it("should search authors by birth date only", async () => {
      const params: AuthorsSearchParams = {
        start_birth_date: "1990-01-01",
        end_birth_date: "1990-12-31",
      };
      const result = {
        count: 1,
        rows: [{ name: "John Doe", bio: "Author bio", birthDate: "1990-01-01" }],
      };
      stubAuthors.countDocuments.resolves(result.count);
      stubAuthors.find.resolves(result.rows);
      const searchedAuthors = await authorRepository.searchAuthors(params);
      expect(searchedAuthors).to.deep.equal(result);
    });

    it("should search authors by order only", async () => {
      const params: AuthorsSearchParams = {
        order: [["name", "asc"]],
      };
      const result = {
        count: 1,
        rows: [{ name: "John Doe", bio: "Author bio" }],
      };
      stubAuthors.countDocuments.resolves(result.count);
      stubAuthors.find.resolves(result.rows);
      const searchedAuthors = await authorRepository.searchAuthors(params);
      expect(searchedAuthors).to.deep.equal(result);
    });

    it("should throw an error if search fails", async () => {
      const params: AuthorsSearchParams = {
        name: "John",
        bio: "Author bio",
        start_birth_date: "1990-01-01",
        end_birth_date: "1990-12-31",
        order: [["name", "asc"]],
      };
      const error = new Error("Search authors failed");
      stubAuthors.countDocuments.rejects(error);
      await expect(
        authorRepository.searchAuthors(params)
      ).to.be.rejectedWith(error);
    });
  });

  describe("getAuthorByName", () => {
    it("should return the author count by name", async () => {
      const name: string = "John Doe";
      const result: number = 1;
      stubAuthors.countDocuments.resolves(result);
      const authorCount = await authorRepository.getAuthorByName(name);
      expect(authorCount).to.equal(result);
    });

    it("should return the author count by name and id", async () => {
      const name: string = "John Doe";
      const id: string = "1234567890";
      const result: number = 1;
      stubAuthors.countDocuments.resolves(result);
      const authorCount = await authorRepository.getAuthorByName(name, id);
      expect(authorCount).to.equal(result);
    });

    it("should throw an error if count documents fails", async () => {
      const name: string = "John Doe";
      const error = new Error("Count documents failed");
      stubAuthors.countDocuments.rejects(error);
      await expect(
        authorRepository.getAuthorByName(name)
      ).to.be.rejectedWith(error);
    });
  });
});