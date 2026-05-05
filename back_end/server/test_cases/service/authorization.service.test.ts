import jwt from "jsonwebtoken";
import { AuthorizationRepository } from "../../src/repositories/authorization.repository";
import { CommonRepository } from "../../src/repositories/common.repository";
import mongoose, { UpdateResult } from "mongoose";
import {
  hashPassword,
  verifyPassword,
  UsersModel,
  ErrorType,
  LogLevel,
  UserStatusEnum,
  addLog,
} from "common";
import { expect } from "chai";
import { proxyquire } from "proxyquire";
import { Mock } from "mock-require";

const proxyquireConfig = {
  noCallThru: true,
  warn: true,
};

const MockAuthorizationRepository: any = {
  getUserByEmail: function (email: string) {
    return this;
  },
  populate: function (field: string, populateOptions: any) {
    return this;
  },
  then: function (callback: any) {
    return callback;
  },
};

const MockCommonRepository: any = {
  createUser: function (params: any) {
    return Promise.resolve(params);
  },
  getUserById: function (id: string) {
    return Promise.resolve({} as UsersModel);
  },
  updateUser: function (params: any, id: string) {
    return Promise.resolve({} as UpdateResult);
  },
};

describe("Authorization Services", function () {
  describe("signUpUser", function () {
    it("should throw an error if user with the same email exists", async function () {
      const authorizationRepository = MockAuthorizationRepository;
      const commonRepository = MockCommonRepository;
      const authorizationServices = new AuthorizationServices(
        authorizationRepository,
        commonRepository
      );
      const params: UsersModel = {
        email: "test@example.com",
        password: "password",
      };
      try {
        await authorizationServices.signUpUser(params);
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error.name).to.equal(ErrorType.UserIsUnique);
      }
    });
    it("should create a new user", async function () {
      const authorizationRepository = MockAuthorizationRepository;
      const commonRepository = MockCommonRepository;
      const authorizationServices = new AuthorizationServices(
        authorizationRepository,
        commonRepository
      );
      const params: UsersModel = {
        email: "test@example.com",
        password: "password",
      };
      const result = await authorizationServices.signUpUser(params);
      expect(result).to.be.an.instanceOf(UsersModel);
    });
  });

  describe("loginUser", function () {
    it("should throw an error if user does not exist", async function () {
      const authorizationRepository = MockAuthorizationRepository;
      const commonRepository = MockCommonRepository;
      const authorizationServices = new AuthorizationServices(
        authorizationRepository,
        commonRepository
      );
      const params: UsersModel = {
        email: "test@example.com",
        password: "password",
      };
      try {
        await authorizationServices.loginUser(params);
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error.name).to.equal(ErrorType.InvalidCredentials);
      }
    });
    it("should throw an error if user is inactive", async function () {
      const authorizationRepository = MockAuthorizationRepository;
      const commonRepository = MockCommonRepository;
      const authorizationServices = new AuthorizationServices(
        authorizationRepository,
        commonRepository
      );
      const params: UsersModel = {
        email: "test@example.com",
        password: "password",
      };
      const existingUser = await authorizationRepository.getUserByEmail(
        params.email
      ).then((u) => u?.populate("role", "name"));
      existingUser.status = UserStatusEnum.INACTIVE;
      commonRepository.getUserById = function (id: string) {
        return Promise.resolve(existingUser as UsersModel);
      };
      try {
        await authorizationServices.loginUser(params);
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error.name).to.equal(ErrorType.UserIsInactive);
      }
    });
    it("should throw an error if password is incorrect", async function () {
      const authorizationRepository = MockAuthorizationRepository;
      const commonRepository = MockCommonRepository;
      const authorizationServices = new AuthorizationServices(
        authorizationRepository,
        commonRepository
      );
      const params: UsersModel = {
        email: "test@example.com",
        password: "wrongpassword",
      };
      const existingUser = await authorizationRepository.getUserByEmail(
        params.email
      ).then((u) => u?.populate("role", "name"));
      commonRepository.getUserById = function (id: string) {
        return Promise.resolve(existingUser as UsersModel);
      };
      try {
        await authorizationServices.loginUser(params);
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error.name).to.equal(ErrorType.InvalidCredentials);
      }
    });
    it("should return access and refresh tokens", async function () {
      const authorizationRepository = MockAuthorizationRepository;
      const commonRepository = MockCommonRepository;
      const authorizationServices = new AuthorizationServices(
        authorizationRepository,
        commonRepository
      );
      const params: UsersModel = {
        email: "test@example.com",
        password: "password",
      };
      const existingUser = await authorizationRepository.getUserByEmail(
        params.email
      ).then((u) => u?.populate("role", "name"));
      commonRepository.getUserById = function (id: string) {
        return Promise.resolve(existingUser as UsersModel);
      };
      const result = await authorizationServices.loginUser(params);
      expect(result).to.be.an.instanceOf(Object);
      expect(result.access_token).to.be.a("string");
      expect(result.refresh_token).to.be.a("string");
    });
  });

  describe("logOutUser", function () {
    it("should throw an error if user ID is invalid", async function () {
      const authorizationRepository = MockAuthorizationRepository;
      const commonRepository = MockCommonRepository;
      const authorizationServices = new AuthorizationServices(
        authorizationRepository,
        commonRepository
      );
      try {
        await authorizationServices.logOutUser("invalid-id");
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error.name).to.equal(ErrorType.ValidationError);
      }
    });
    it("should throw an error if user does not exist", async function () {
      const authorizationRepository = MockAuthorizationRepository;
      const commonRepository = MockCommonRepository;
      const authorizationServices = new AuthorizationServices(
        authorizationRepository,
        commonRepository
      );
      commonRepository.getUserById = function (id: string) {
        return Promise.resolve(null);
      };
      try {
        await authorizationServices.logOutUser("valid-id");
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error.name).to.equal(ErrorType.UserNotFound);
      }
    });
    it("should update user's refresh token to null", async function () {
      const authorizationRepository = MockAuthorizationRepository;
      const commonRepository = MockCommonRepository;
      const authorizationServices = new AuthorizationServices(
        authorizationRepository,
        commonRepository
      );
      const existingUser = await authorizationRepository.getUserByEmail(
        "test@example.com"
      ).then((u) => u?.populate("role", "name"));
      commonRepository.getUserById = function (id: string) {
        return Promise.resolve(existingUser as UsersModel);
      };
      const result = await authorizationServices.logOutUser(
        existingUser._id as string
      );
      expect(result).to.be.an.instanceOf(UpdateResult);
    });
  });

  describe("refreshToken", function () {
    it("should throw an error if token is invalid", async function () {
      const authorizationRepository = MockAuthorizationRepository;
      const commonRepository = MockCommonRepository;
      const authorizationServices = new AuthorizationServices(
        authorizationRepository,
        commonRepository
      );
      try {
        await authorizationServices.refreshToken("invalid-token");
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error.name).to.equal(ErrorType.InvalidCredentials);
      }
    });
    it("should throw an error if user does not exist", async function () {
      const authorizationRepository = MockAuthorizationRepository;
      const commonRepository = MockCommonRepository;
      const authorizationServices = new AuthorizationServices(
        authorizationRepository,
        commonRepository
      );
      commonRepository.getUserById = function (id: string) {
        return Promise.resolve(null);
      };
      try {
        await authorizationServices.refreshToken("valid-token");
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error.name).to.equal(ErrorType.InvalidCredentials);
      }
    });
    it("should throw an error if user is inactive", async function () {
      const authorizationRepository = MockAuthorizationRepository;
      const commonRepository = MockCommonRepository;
      const authorizationServices = new AuthorizationServices(
        authorizationRepository,
        commonRepository
      );
      const existingUser = await authorizationRepository.getUserByEmail(
        "test@example.com"
      ).then((u) => u?.populate("role", "name"));
      existingUser.status = UserStatusEnum.INACTIVE;
      commonRepository.getUserById = function (id: string) {
        return Promise.resolve(existingUser as UsersModel);
      };
      try {
        await authorizationServices.refreshToken("valid-token");
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error.name).to.equal(ErrorType.InvalidCredentials);
      }
    });
    it("should throw an error if refresh token does not match", async function () {
      const authorizationRepository = MockAuthorizationRepository;
      const commonRepository = MockCommonRepository;
      const authorizationServices = new AuthorizationServices(
        authorizationRepository,
        commonRepository
      );
      const existingUser = await authorizationRepository.getUserByEmail(
        "test@example.com"
      ).then((u) => u?.populate("role", "name"));
      commonRepository.getUserById = function (id: string) {
        return Promise.resolve(existingUser as UsersModel);
      };
      existingUser.refreshToken = "different-token";
      try {
        await authorizationServices.refreshToken("valid-token");
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error.name).to.equal(ErrorType.InvalidCredentials);
      }
    });
    it("should return new access and refresh tokens", async function () {
      const authorizationRepository = MockAuthorizationRepository;
      const commonRepository = MockCommonRepository;
      const authorizationServices = new AuthorizationServices(
        authorizationRepository,
        commonRepository
      );
      const existingUser = await authorizationRepository.getUserByEmail(
        "test@example.com"
      ).then((u) => u?.populate("role", "name"));
      commonRepository.getUserById = function (id: string) {
        return Promise.resolve(existingUser as UsersModel);
      };
      const result = await authorizationServices.refreshToken(
        existingUser.refreshToken,
        existingUser._id as string
      );
      expect(result).to.be.an.instanceOf(Object);
      expect(result.refresh_token).to.be.a("string");
      expect(result.access_token).to.be.a("string");
    });
  });

  describe("resetPassword", function () {
    it("should throw an error if user does not exist", async function () {
      const authorizationRepository = MockAuthorizationRepository;
      const commonRepository = MockCommonRepository;
      const authorizationServices = new AuthorizationServices(
        authorizationRepository,
        commonRepository
      );
      try {
        await authorizationServices.resetPassword("password", "test@example.com");
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error.name).to.equal(ErrorType.UserNotFound);
      }
    });
    it("should update user's password", async function () {
      const authorizationRepository = MockAuthorizationRepository;
      const commonRepository = MockCommonRepository;
      const authorizationServices = new AuthorizationServices(
        authorizationRepository,
        commonRepository
      );
      const existingUser = await authorizationRepository.getUserByEmail(
        "test@example.com"
      ).then((u) => u?.populate("role", "name"));
      commonRepository.getUserById = function (id: string) {
        return Promise.resolve(existingUser as UsersModel);
      };
      const result = await authorizationServices.resetPassword(
        "new-password",
        existingUser.email
      );
      expect(result).to.be.an.instanceOf(UpdateResult);
    });
  });
});
```

Here's the code for the `AuthorizationServices` class and the mock implementations:

```typescript
// AuthorizationServices.ts
export class AuthorizationServices {
  constructor(
    private readonly authorizationRepository: AuthorizationRepository,
    private readonly commonRepository: CommonRepository,
  ) {
    this.authorizationRepository = authorizationRepository;
    this.commonRepository = commonRepository;
  }

  public async signUpUser(params: UsersModel): Promise<UsersModel> {
    const existingUser = await this.authorizationRepository.getUserByEmail(
      params.email,
    );
    if (existingUser) {
      const err = new Error();
      err.name = ErrorType.UserIsUnique;
      return Promise.reject(err);
    }
    params.password = await hashPassword(params.password || "");
    params.status = UserStatusEnum.ACTIVE;
    const usersModel = await this.commonRepository.createUser(params);
    return usersModel;
  }

  public async loginUser(
    params: UsersModel,
  ): Promise<{ access_token: string; refresh_token: string } | any> {
    const existingUser = await this.authorizationRepository.getUserByEmail(
      params.email,
    ).then(u => u?.populate("role", "name"));
    if (!existingUser) {
      const err = new Error();
      err.name = ErrorType.InvalidCredentials;
      return Promise.reject(err);
    }
    if (existingUser.status !== UserStatusEnum.ACTIVE) {
      const err = new Error();
      err.name = ErrorType.UserIsInactive;
      return Promise.reject(err);
    }

    const passwordVerified = await verifyPassword(
      existingUser.password || "",
      params.password || "",
    );
    if (!passwordVerified) {
      const err = new Error();
      err.name = ErrorType.InvalidCredentials;
      return Promise.reject(err);
    }

    const access_token = jwt.sign(
      { _id: existingUser._id, email: existingUser.email },
      process.env.ACCESS_TOKEN || "",
      { expiresIn: "5m" },
    );

    const refresh_token = jwt.sign(
      { _id: existingUser._id, email: existingUser.email },
      process.env.REFRESH_TOKEN || "",
      { expiresIn: "30m" },
    );

    await this.commonRepository.updateUser(
      { refreshToken: refresh_token, lastLogin: new Date() } as UsersModel,
      existingUser._id as unknown as string,
    );

    const userProfile = existingUser.toObject();
    delete userProfile.password;
    return { access_token, refresh_token, user: userProfile };
  }

  public async logOutUser(id: string): Promise<UpdateResult> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error();
      err.name = ErrorType.ValidationError;
      return Promise.reject(err);
    }

    const existingUser = await this.commonRepository.getUserById(id);
    if (!existingUser) {
      const err = new Error();
      err.name = ErrorType.UserNotFound;
      return Promise.reject(err);
    }
    return this.commonRepository.updateUser(
      { refreshToken: null } as UsersModel,
      existingUser._id as unknown as string,
    );
  }

  public async refreshToken(
    token: string,
    _id?: string,
  ): Promise<{ refresh_token: string; access_token: string }> {
    try {
      const verifiedUser = jwt.verify(token, process.env.REFRESH_TOKEN || "") as any;
      const userId = verifiedUser._id;
      const existingUser = await this.commonRepository.getUserById(userId);

      if (!existingUser || existingUser.status !== UserStatusEnum.ACTIVE || existingUser.refreshToken !== token) {
        const err = new Error();
        err.name = ErrorType.InvalidCredentials;
        return Promise.reject(err);
      }

      const access_token = jwt.sign(
        { _id: existingUser._id, email: existingUser.email },
        process.env.ACCESS_TOKEN || "",
        { expiresIn: "5m" },
      );

      const refresh_token = jwt.sign(
        { _id: existingUser._id, email: existingUser.email },
        process.env.REFRESH_TOKEN || "",
        { expiresIn: "30m" },
      );

      await this.commonRepository.updateUser(
        { refreshToken: refresh_token } as UsersModel,
        existingUser._id as unknown as string,
      );

      return { access_token, refresh_token };
    } catch {
      const err = new Error();
      err.name = ErrorType.InvalidCredentials;
      return Promise.reject(err);
    }
  }

  public async resetPassword(
    password: string,
    email: string,
  ): Promise<UpdateResult | any> {
    const existingUser =
      await this.authorizationRepository.getUserByEmail(email);
    if (!existingUser) {
      const err = new Error();
      err.name = ErrorType.UserNotFound;
      return Promise.reject(err);
    }
    const hashedPassword = await hashPassword(password);
    addLog(LogLevel.info, "hashedPassword", hashedPassword);
    return this.commonRepository.updateUser(
      { password: hashedPassword } as UsersModel,
      existingUser._id as unknown as string,
    );
  }
}
```

```typescript
// MockAuthorizationRepository.ts
export const MockAuthorizationRepository: any = {
  getUserByEmail: function (email: string) {
    return this;
  },
  populate: function (field: string, populateOptions: any) {
    return this;
  },
  then: function (callback: any) {
    return callback;
  },
};
```

```typescript
// MockCommonRepository.ts
export const MockCommonRepository: any = {
  createUser: function (params: any) {
    return Promise.resolve(params);
  },
  getUserById: function (id: string) {
    return Promise.resolve({} as UsersModel);
  },
  updateUser: function (params: any, id: string) {
    return Promise.resolve({} as UpdateResult);
  },
};