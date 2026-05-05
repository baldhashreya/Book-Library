import { expect } from "chai";
import proxyquire from "proxyquire";
import { UsersModel, Users } from "common";

type UsersModelMock = any;
type UsersMock = any;

const UsersModelMock: UsersModelMock = {
  findOne: () => Promise.resolve(null),
};

const UsersMock: UsersMock = {
  findOne: () => Promise.resolve(null),
  create: () => Promise.resolve({}),
  findById: () => Promise.resolve({}),
  updateOne: () => Promise.resolve({}),
  findByIdAndDelete: () => Promise.resolve({}),
  countDocuments: () => Promise.resolve(0),
  find: () => Promise.resolve([]),
};

const UsersModelMockError: UsersModelMock = {
  findOne: () => Promise.reject(new Error("test error")),
};

const UsersMockError: UsersMock = {
  findOne: () => Promise.reject(new Error("test error")),
};

describe("AuthorizationRepository", () => {
  const { AuthorizationRepository } = proxyquire("../../src/repositories/authorization.repository", {
    "common": { Users: UsersMock, UsersModel: UsersModelMock },
  });

  const repo = new AuthorizationRepository();

  it("getUserByEmail - found user", async () => {
    UsersMock.findOne = () => Promise.resolve({ email: "test@example.com" });
    const result = await repo.getUserByEmail("test@example.com");
    expect(result).to.be.an("object");
  });

  it("getUserByEmail - not found", async () => {
    UsersMock.findOne = () => Promise.resolve(null);
    const result = await repo.getUserByEmail("test@example.com");
    expect(result).to.be.null;
  });

  it("getUserByEmail - error", async () => {
    UsersMockError.findOne = () => Promise.reject(new Error("test error"));
    try {
      await repo.getUserByEmail("test@example.com");
      expect.fail("Expected an error to be thrown");
    } catch (error) {
      expect(error.message).to.equal("test error");
    }
  });

  it("getUserByEmail - invalid input", async () => {
    const result = await repo.getUserByEmail(null);
    expect(result).to.be.null;
  });

  const { AuthorizationRepository: AuthorizationRepositoryWithoutUsersModel } = proxyquire("../../src/repositories/authorization.repository", {
    "common": { Users: UsersMock },
  });

  const repoWithoutUsersModel = new AuthorizationRepositoryWithoutUsersModel();

  it("getUserByEmail without UsersModel - found user", async () => {
    UsersMock.findOne = () => Promise.resolve({ email: "test@example.com" });
    const result = await repoWithoutUsersModel.getUserByEmail("test@example.com");
    expect(result).to.be.an("object");
  });

  it("getUserByEmail without UsersModel - not found", async () => {
    UsersMock.findOne = () => Promise.resolve(null);
    const result = await repoWithoutUsersModel.getUserByEmail("test@example.com");
    expect(result).to.be.null;
  });

  it("getUserByEmail without UsersModel - error", async () => {
    UsersMockError.findOne = () => Promise.reject(new Error("test error"));
    try {
      await repoWithoutUsersModel.getUserByEmail("test@example.com");
      expect.fail("Expected an error to be thrown");
    } catch (error) {
      expect(error.message).to.equal("test error");
    }
  });

  it("getUserByEmail without UsersModel - invalid input", async () => {
    const result = await repoWithoutUsersModel.getUserByEmail(null);
    expect(result).to.be.null;
  });
});