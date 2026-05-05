import { expect } from "chai";
import proxyquire from "proxyquire";

const DependencyMock: any = {
  find: function() { return this; },
  sort: function() { return this; },
  skip: function() { return this; },
  limit: function() { return this; },
  then: (resolve: any) => resolve([]),
  countDocuments: () => Promise.resolve(0),
  create: (data: any) => Promise.resolve(data),
  findByIdAndUpdate: () => Promise.resolve(null),
  findByIdAndDelete: () => Promise.resolve(null),
  countDocuments: () => Promise.resolve(0)
};

const { RolesRepository } = proxyquire("../../src/repositories/roles.repository", {
  "common": {
    Roles: DependencyMock,
    addLog: () => {},
    LogLevel: { info: "info", error: "error" }
  }
});

describe("RolesRepository", () => {
  const repo = new RolesRepository();
  it("should create role", async () => {
    try {
      const result = await repo.createRole({ name: "test", permissions: ["test"] } as any);
      expect(result).to.be.an("object");
    } catch (error: any) {
      expect(error).to.be.undefined;
    }
  });

  it("should update role", async () => {
    try {
      const result = await repo.updateRoleById({ name: "test", permissions: ["test"] } as any, "1234567890");
      expect(result).to.be.an("object");
    } catch (error: any) {
      expect(error).to.be.undefined;
    }
  });

  it("should delete role", async () => {
    try {
      const result = await repo.deleteRoleById("1234567890");
      expect(result).to.be.an("object");
    } catch (error: any) {
      expect(error).to.be.undefined;
    }
  });

  it("should search roles", async () => {
    try {
      const result = await repo.searchRoles({ name: "test", permissions: ["test"], description: "test" } as any);
      expect(result).to.be.an("object");
      expect(result.rows).to.be.an("array");
    } catch (error: any) {
      expect(error).to.be.undefined;
    }
  });

  it("should get role by name", async () => {
    try {
      const result = await repo.getRoleByName("test");
      expect(result).to.be.a("number");
    } catch (error: any) {
      expect(error).to.be.undefined;
    }
  });

  it("should get role by name with id", async () => {
    try {
      const result = await repo.getRoleByName("test", "1234567890");
      expect(result).to.be.a("number");
    } catch (error: any) {
      expect(error).to.be.undefined;
    }
  });
});