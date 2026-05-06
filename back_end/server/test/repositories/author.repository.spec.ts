import { expect } from "chai";
import { mock, instance, when, verify, reset } from "ts-mockito";
import { UpdateResult } from "mongoose";
import { addLog, AuthorModel, Authors, LogLevel } from "common";
import { AuthorsSearchParams } from "../interface/common.interface";
import { AuthorRepository } from "../../src/repositories/author.repository";
import { proxyquire } from "proxyquire";

describe("AuthorRepository", () => {
  let authorsMock: any;
  let addLogMock: any;
  let authorRepository: AuthorRepository;

  beforeEach(() => {
    authorsMock = mock(Authors);
    addLogMock = mock(addLog);
    authorRepository = new AuthorRepository();
  });

  afterEach(() => {
    reset(authorsMock);
    reset(addLogMock);
  });

  describe("createAuthor", () => {
    it("should create a new author", async () => {
      const authorData: AuthorModel = {
        name: "John Doe",
        bio: "Software developer",
        birthDate: new Date("1990-01-01"),
      };

      when(authorsMock.create(authorData)).thenResolve(authorData);

      const result = await authorRepository.createAuthor(authorData);

      expect(result).to.deep.equal(authorData);
      verify(authorsMock.create(authorData)).once();
    });

    it("should throw an error if create fails", async () => {
      const authorData: AuthorModel = {
        name: "John Doe",
        bio: "Software developer",
        birthDate: new Date("1990-01-01"),
      };

      when(authorsMock.create(authorData)).thenReject(new Error("Create failed"));

      try {
        await authorRepository.createAuthor(authorData);
        expect.fail("Expected an error to be thrown");
      } catch (error) {
        expect(error.message).to.equal("Create failed");
      }
    });
  });

  describe("getAuthorById", () => {
    it("should return an author by id", async () => {
      const id = "1234567890";
      const authorData: AuthorModel = {
        name: "John Doe",
        bio: "Software developer",
        birthDate: new Date("1990-01-01"),
        _id: id,
      };

      when(authorsMock.findById({ _id: id })).thenResolve(authorData);

      const result = await authorRepository.getAuthorById(id);

      expect(result).to.deep.equal(authorData);
      verify(authorsMock.findById({ _id: id })).once();
    });

    it("should return null if author not found", async () => {
      const id = "1234567890";

      when(authorsMock.findById({ _id: id })).thenResolve(null);

      const result = await authorRepository.getAuthorById(id);

      expect(result).to.be.null;
      verify(authorsMock.findById({ _id: id })).once();
    });
  });

  describe("updateAuthor", () => {
    it("should update an author", async () => {
      const id = "1234567890";
      const authorData: AuthorModel = {
        name: "John Doe",
        bio: "Software developer",
        birthDate: new Date("1990-01-01"),
      };

      when(authorsMock.updateOne({ _id: id }, authorData)).thenResolve({ modifiedCount: 1 });

      const result = await authorRepository.updateAuthor(id, authorData);

      expect(result).to.deep.equal({ modifiedCount: 1 });
      verify(authorsMock.updateOne({ _id: id }, authorData)).once();
    });

    it("should throw an error if update fails", async () => {
      const id = "1234567890";
      const authorData: AuthorModel = {
        name: "John Doe",
        bio: "Software developer",
        birthDate: new Date("1990-01-01"),
      };

      when(authorsMock.updateOne({ _id: id }, authorData)).thenReject(new Error("Update failed"));

      try {
        await authorRepository.updateAuthor(id, authorData);
        expect.fail("Expected an error to be thrown");
      } catch (error) {
        expect(error.message).to.equal("Update failed");
      }
    });
  });

  describe("deleteAuthor", () => {
    it("should delete an author", async () => {
      const id = "1234567890";
      const authorData: AuthorModel = {
        name: "John Doe",
        bio: "Software developer",
        birthDate: new Date("1990-01-01"),
        _id: id,
      };

      when(authorsMock.findByIdAndDelete({ _id: id })).thenResolve(authorData);

      const result = await authorRepository.deleteAuthor(id);

      expect(result).to.deep.equal(authorData);
      verify(authorsMock.findByIdAndDelete({ _id: id })).once();
    });

    it("should return null if author not found", async () => {
      const id = "1234567890";

      when(authorsMock.findByIdAndDelete({ _id: id })).thenResolve(null);

      const result = await authorRepository.deleteAuthor(id);

      expect(result).to.be.null;
      verify(authorsMock.findByIdAndDelete({ _id: id })).once();
    });
  });

  describe("searchAuthors", () => {
    it("should search authors by name", async () => {
      const params: AuthorsSearchParams = {
        name: "John",
      };

      const authorData: AuthorModel = {
        name: "John Doe",
        bio: "Software developer",
        birthDate: new Date("1990-01-01"),
      };

      when(authorsMock.countDocuments({ name: { $regex: params.name, $options: "i" } })).thenResolve(1);
      when(authorsMock.find({ name: { $regex: params.name, $options: "i" } }).sort({ createdAt: -1 }).skip(0).limit(10)).thenResolve([authorData]);

      const result = await authorRepository.searchAuthors(params);

      expect(result).to.deep.equal({ count: 1, rows: [authorData] });
      verify(authorsMock.countDocuments({ name: { $regex: params.name, $options: "i" } })).once();
      verify(authorsMock.find({ name: { $regex: params.name, $options: "i" } }).sort({ createdAt: -1 }).skip(0).limit(10)).once();
    });

    it("should search authors by bio", async () => {
      const params: AuthorsSearchParams = {
        bio: "Software developer",
      };

      const authorData: AuthorModel = {
        name: "John Doe",
        bio: "Software developer",
        birthDate: new Date("1990-01-01"),
      };

      when(authorsMock.countDocuments({ bio: { $regex: params.bio, $options: "i" } })).thenResolve(1);
      when(authorsMock.find({ bio: { $regex: params.bio, $options: "i" } }).sort({ createdAt: -1 }).skip(0).limit(10)).thenResolve([authorData]);

      const result = await authorRepository.searchAuthors(params);

      expect(result).to.deep.equal({ count: 1, rows: [authorData] });
      verify(authorsMock.countDocuments({ bio: { $regex: params.bio, $options: "i" } })).once();
      verify(authorsMock.find({ bio: { $regex: params.bio, $options: "i" } }).sort({ createdAt: -1 }).skip(0).limit(10)).once();
    });

    it("should search authors by birth date", async () => {
      const params: AuthorsSearchParams = {
        start_birth_date: new Date("1990-01-01"),
      };

      const authorData: AuthorModel = {
        name: "John Doe",
        bio: "Software developer",
        birthDate: new Date("1990-01-01"),
      };

      when(authorsMock.countDocuments({ birthDate: { $gte: params.start_birth_date } })).thenResolve(1);
      when(authorsMock.find({ birthDate: { $gte: params.start_birth_date } }).sort({ createdAt: -1 }).skip(0).limit(10)).thenResolve([authorData]);

      const result = await authorRepository.searchAuthors(params);

      expect(result).to.deep.equal({ count: 1, rows: [authorData] });
      verify(authorsMock.countDocuments({ birthDate: { $gte: params.start_birth_date } })).once();
      verify(authorsMock.find({ birthDate: { $gte: params.start_birth_date } }).sort({ createdAt: -1 }).skip(0).limit(10)).once();
    });

    it("should search authors by order", async () => {
      const params: AuthorsSearchParams = {
        order: [["name", "asc"]],
      };

      const authorData: AuthorModel = {
        name: "John Doe",
        bio: "Software developer",
        birthDate: new Date("1990-01-01"),
      };

      when(authorsMock.countDocuments({})).thenResolve(1);
      when(authorsMock.find({}).sort({ name: 1 }).skip(0).limit(10)).thenResolve([authorData]);

      const result = await authorRepository.searchAuthors(params);

      expect(result).to.deep.equal({ count: 1, rows: [authorData] });
      verify(authorsMock.countDocuments({})).once();
      verify(authorsMock.find({}).sort({ name: 1 }).skip(0).limit(10)).once();
    });

    it("should throw an error if search fails", async () => {
      const params