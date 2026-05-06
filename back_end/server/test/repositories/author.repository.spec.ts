import { expect } from "chai";
import { mock, instance, verify, reset, when, anything } from "ts-mockito";
import { UpdateResult } from "mongoose";
import { addLog, AuthorModel, Authors, LogLevel } from "common";
import { AuthorsSearchParams } from "../interface/common.interface";
import { AuthorRepository } from "../../src/repositories/author.repository";

describe("AuthorRepository", () => {
  let authors: any;
  let authorRepository: AuthorRepository;

  beforeEach(() => {
    authors = mock(Authors);
    authorRepository = new AuthorRepository();
  });

  afterEach(() => {
    reset(authors);
  });

  describe("createAuthor", () => {
    it("should create a new author", async () => {
      const authorData: AuthorModel = {
        name: "John Doe",
        bio: "Software developer",
        birthDate: new Date("1990-01-01"),
      };

      when(authors.create(anything())).thenResolve(authorData);

      const result = await authorRepository.createAuthor(authorData);

      expect(result).to.deep.equal(authorData);
      verify(authors.create(authorData)).once();
    });
  });

  describe("getAuthorById", () => {
    it("should get an author by id", async () => {
      const id = "1234567890";
      const authorData: AuthorModel = {
        name: "John Doe",
        bio: "Software developer",
        birthDate: new Date("1990-01-01"),
        _id: id,
      };

      when(authors.findById(anything())).thenResolve(authorData);

      const result = await authorRepository.getAuthorById(id);

      expect(result).to.deep.equal(authorData);
      verify(authors.findById({ _id: id })).once();
    });

    it("should return null if author not found", async () => {
      const id = "1234567890";

      when(authors.findById(anything())).thenResolve(null);

      const result = await authorRepository.getAuthorById(id);

      expect(result).to.be.null;
      verify(authors.findById({ _id: id })).once();
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

      when(authors.updateOne(anything(), anything())).thenResolve({ n: 1, nModified: 1 });

      const result = await authorRepository.updateAuthor(id, authorData);

      expect(result).to.deep.equal({ n: 1, nModified: 1 });
      verify(authors.updateOne({ _id: id }, authorData)).once();
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

      when(authors.findByIdAndDelete(anything())).thenResolve(authorData);

      const result = await authorRepository.deleteAuthor(id);

      expect(result).to.deep.equal(authorData);
      verify(authors.findByIdAndDelete({ _id: id })).once();
    });
  });

  describe("searchAuthors", () => {
    it("should search authors by name", async () => {
      const params: AuthorsSearchParams = {
        name: "John",
      };

      const query = {};
      when(authors.countDocuments(anything())).thenResolve(1);
      const mockQuery = mock<any>();
      when(authors.find(anything())).thenReturn(instance(mockQuery));
      when(mockQuery.sort(anything())).thenReturn(instance(mockQuery));
      when(mockQuery.limit(anything())).thenResolve([{ name: "John Doe" }] as any);

      const result = await authorRepository.searchAuthors(params);

      expect(result).to.deep.equal({ count: 1, rows: [{ name: "John Doe" }] });
      verify(authors.countDocuments({ name: { $regex: "John", $options: "i" } })).once();
      verify(authors.find({ name: { $regex: "John", $options: "i" } })).once();
    });

    it("should search authors by bio", async () => {
      const params: AuthorsSearchParams = {
        bio: "Software",
      };

      const query = {};
      when(authors.countDocuments(anything())).thenResolve(1);
      const mockQuery = mock<any>();
      when(authors.find(anything())).thenReturn(instance(mockQuery));
      when(mockQuery.sort(anything())).thenReturn(instance(mockQuery));
      when(mockQuery.limit(anything())).thenResolve([{ bio: "Software developer" }] as any);

      const result = await authorRepository.searchAuthors(params);

      expect(result).to.deep.equal({ count: 1, rows: [{ bio: "Software developer" }] });
      verify(authors.countDocuments({ bio: { $regex: "Software", $options: "i" } })).once();
      verify(authors.find({ bio: { $regex: "Software", $options: "i" } })).once();
    });

    it("should search authors by birth date", async () => {
      const params: AuthorsSearchParams = {
        start_birth_date: "1990-01-01",
        end_birth_date: "1990-12-31",
      };

      const query = {};
      when(authors.countDocuments(anything())).thenResolve(1);
      const mockQuery = mock<any>();
      when(authors.find(anything())).thenReturn(instance(mockQuery));
      when(mockQuery.sort(anything())).thenReturn(instance(mockQuery));
      when(mockQuery.limit(anything())).thenResolve([{ birthDate: new Date("1990-01-01") }] as any);

      const result = await authorRepository.searchAuthors(params);

      expect(result).to.deep.equal({ count: 1, rows: [{ birthDate: new Date("1990-01-01") }] });
      verify(authors.countDocuments({ birthDate: { $gte: "1990-01-01", $lte: "1990-12-31" } })).once();
      verify(authors.find({ birthDate: { $gte: "1990-01-01", $lte: "1990-12-31" } })).once();
    });

    it("should order authors by default", async () => {
      const params: AuthorsSearchParams = {
        name: "John",
      };

      const query = {};
      when(authors.countDocuments(anything())).thenResolve(1);
      const mockQuery = mock<any>();
      when(authors.find(anything())).thenReturn(instance(mockQuery));
      when(mockQuery.sort(anything())).thenReturn(instance(mockQuery));
      when(mockQuery.limit(anything())).thenResolve([{ name: "John Doe" }] as any);

      const result = await authorRepository.searchAuthors(params);

      expect(result).to.deep.equal({ count: 1, rows: [{ name: "John Doe" }] });
      verify(authors.countDocuments({ name: { $regex: "John", $options: "i" } })).once();
      verify(authors.find({ name: { $regex: "John", $options: "i" } })).once();
      verify(mockQuery.sort({ createdAt: -1 })).once();
    });

    it("should order authors by custom field", async () => {
      const params: AuthorsSearchParams = {
        name: "John",
        order: [["name", "asc"]],
      };

      const query = {};
      when(authors.countDocuments(anything())).thenResolve(1);
      const mockQuery = mock<any>();
      when(authors.find(anything())).thenReturn(instance(mockQuery));
      when(mockQuery.sort(anything())).thenReturn(instance(mockQuery));
      when(mockQuery.limit(anything())).thenResolve([{ name: "John Doe" }] as any);

      const result = await authorRepository.searchAuthors(params);

      expect(result).to.deep.equal({ count: 1, rows: [{ name: "John Doe" }] });
      verify(authors.countDocuments({ name: { $regex: "John", $options: "i" } })).once();
      verify(authors.find({ name: { $regex: "John", $options: "i" } })).once();
      verify(mockQuery.sort({ name: 1 })).once();
    });
  });

  describe("getAuthorByName", () => {
    it("should get author count by name", async () => {
      const name = "John";
      const id = "1234567890";

      when(authors.countDocuments(anything())).thenResolve(1);

      const result = await authorRepository.getAuthorByName(name, id);

      expect(result).to.equal(1);
      verify(authors.countDocuments({ name, _id: { $ne: id } })).once();
    });

    it("should get author count by name without id", async () => {
      const name = "John";

      when(authors.countDocuments(anything())).thenResolve(1);

      const result = await authorRepository.getAuthorByName(name);

      expect(result).to.equal(1);
      verify(authors.countDocuments({ name })).once();
    });
  });
});