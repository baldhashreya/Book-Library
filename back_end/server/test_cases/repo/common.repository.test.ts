import { expect } from "chai";
import proxyquire from "proxyquire";

const UsersModelMock: any = {
  find: () => UsersModelMock,
  findById: () => UsersModelMock,
  populate: () => UsersModelMock,
  create: (data: any) => Promise.resolve(data),
  updateOne: () => Promise.resolve({ modifiedCount: 1 }),
  exec: () => Promise.resolve([]),
};

const UsersMock: any = {
  updateOne: () => Promise.resolve({ modifiedCount: 1 }),
};

const RolesMock: any = {
  find: () => RolesMock,
  findById: () => RolesMock,
  exec: () => Promise.resolve([]),
};

const RoleModelMock: any = {
  save: () => Promise.resolve({}),
};

const commonMock: any = {
  Users: UsersModelMock,
  UsersModel: UsersMock,
  Roles: RolesMock,
  RoleModel: RoleModelMock,
  addLog: () => {},
  LogLevel: { info: "info", error: "error" },
};

const { CommonRepository } = proxyquire("../../src/repositories/common.repository", {
  "common": commonMock,
  "mongoose": {
    UpdateResult: class UpdateResult {},
  },
});

describe("CommonRepository", () => {
  const repo = new CommonRepository();

  it("should get roles", async () => {
    try {
      const result = await repo.getRoles();
      expect(result).to.be.an("array");
      expect(result).to.have.lengthOf(0);
    } catch (error: any) {
      throw error;
    }
  });

  it("should get role by id", async () => {
    try {
      const result = await repo.getRoleById("mockId");
      expect(result).to.be.an("object");
      expect(result).to.be.null;
    } catch (error: any) {
      throw error;
    }
  });

  it("should update user", async () => {
    try {
      const param = { name: "mockName" };
      const id = "mockId";
      const result = await repo.updateUser(param, id);
      expect(result).to.be.an("object");
    } catch (error: any) {
      throw error;
    }
  });

  it("should get user by id", async () => {
    try {
      const id = "mockId";
      const result = await repo.getUserById(id);
      expect(result).to.be.an("object");
      expect(result).to.be.null;
    } catch (error: any) {
      throw error;
    }
  });

  it("should create user", async () => {
    try {
      const param = { name: "mockName" };
      const result = await repo.createUser(param);
      expect(result).to.be.an("object");
    } catch (error: any) {
      throw error;
    }
  });
});