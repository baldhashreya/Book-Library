import "reflect-metadata";
import { expect } from "chai";
import { SinonStub, stub } from "sinon";
import { UsersModel } from "common";
import { AuthorizationRepository } from "./authorization.repository";
import { usersModelStub } from "./mocks/usersModel.stub";

describe("AuthorizationRepository", () => {
  let authorizationRepository: AuthorizationRepository;
  let usersModel: SinonStub;

  beforeEach(() => {
    usersModel = usersModelStub;
    authorizationRepository = new AuthorizationRepository(usersModel);
    sinon.restore();
  });

  describe("getUserByEmail", () => {
    it("should find a user by email when email exists in database", async () => {
      const email = "test@example.com";
      const user = { email };
      usersModel.findOne.resolves(user);
      const result = await authorizationRepository.getUserByEmail(email);
      expect(result).to.be.an("object");
      expect(result).to.deep.equal(user);
      expect(usersModel.findOne).to.have.been.calledWith({ email });
    });

    it("should return null when email does not exist in database", async () => {
      const email = "test@example.com";
      usersModel.findOne.resolves(null);
      const result = await authorizationRepository.getUserByEmail(email);
      expect(result).to.be.null;
      expect(usersModel.findOne).to.have.been.calledWith({ email });
    });

    it("should throw an error when database operation fails", async () => {
      const email = "test@example.com";
      usersModel.findOne.rejects(new Error("Database error"));
      await expect(authorizationRepository.getUserByEmail(email)).to.be.rejected;
      expect(usersModel.findOne).to.have.been.calledWith({ email });
    });

    it("should throw an error when email is not provided", async () => {
      await expect(authorizationRepository.getUserByEmail(undefined)).to.be.rejected;
      expect(usersModel.findOne).not.to.have.been.called;
    });
  });
});

// mocks/usersModel.stub.ts
import { SinonStub } from "sinon";
import { UsersModel } from "common";

export const usersModelStub = () => {
  return {
    findOne: stub<UsersModel, (query: any) => Promise<any>>(),
  };
};