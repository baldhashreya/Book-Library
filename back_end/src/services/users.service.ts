import { Types, UpdateResult } from "mongoose";
import { UsersModel } from "../../common/database/models/users";
import { ErrorType, LogLevel, UserStatusEnum } from "../../common/enum";
import { CommonRepository } from "../repositories/common.repository";
import { UsersRepository } from "../repositories/users.repository";
import { hashPassword } from "../../common/common-functions";
import fs from "fs";
import path from "path";
import {
  UpsertUsersModel,
  UsersSearchParams,
} from "../interface/common.interface";
import { addLog } from "../../common/logger";

export class UsersServices {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly commonRepository: CommonRepository
  ) {
    this.usersRepository = usersRepository;
    this.commonRepository = commonRepository;
  }

  public async createUsers(): Promise<void> {
    try {
      const fileContent = fs.readFileSync(
        path.resolve("common", "database", "data", "users.json"),
        "utf-8"
      );
      const result = JSON.parse(fileContent);
      const rolesModel = await this.commonRepository.getRoles();
      let data = [] as UsersModel[];
      for (let i = 0; i < result.length; i++) {
        if (i < 5) {
          data.push({
            ...result[i],
            password: await hashPassword(result[i].password),
            status: UserStatusEnum.ACTIVE,
            role: rolesModel.find((e) => e.name === "Admin")?._id,
          });
        } else if (i > 5 && i < 15) {
          data.push({
            ...result[i],
            password: await hashPassword(result[i].password),
            status: UserStatusEnum.ACTIVE,
            role: rolesModel.find((e) => e.name === "Librarian")?._id,
          });
        } else {
          data.push({
            ...result[i],
            password: await hashPassword(result[i].password),
            status: UserStatusEnum.ACTIVE,
            role: rolesModel.find((e) => e.name === "Member")?._id,
          });
        }
      }
      addLog(LogLevel.info, "Users Model", data);
      await this.usersRepository.createUsers(data);
    } catch (err) {
      console.error(err);
    }
  }

  public async createUser(params: UpsertUsersModel): Promise<UsersModel> {
    await this.validateRequestModel(params);
    if (params.password) {
      params.password = await hashPassword(params.password);
    }
    const model = {
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      role: params.role as unknown as Types.ObjectId,
      status: UserStatusEnum.ACTIVE,
      contactInfo: {
        phone: params.phone,
        address: params.address,
      },
    } as UsersModel;
    return this.commonRepository.createUser(model);
  }

  public async updateUser(
    params: UpsertUsersModel,
    id: string
  ): Promise<UpdateResult> {
    await this.validateRequestModel(params, id);
    const model = {
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      role: params.role as unknown as Types.ObjectId,
      status: UserStatusEnum.ACTIVE,
      contactInfo: {
        phone: params.phone,
        address: params.address,
      },
    } as UsersModel;
    return this.commonRepository.updateUser(model, id);
  }

  public async deleteUser(id: string): Promise<UsersModel | null> {
    const deletedUser = await this.usersRepository.deleteUser(id);
    if (!deletedUser) {
      const err = new Error();
      err.name = ErrorType.UserNotFound;
      return Promise.reject(err);
    }
    return deletedUser;
  }

  public async searchUsers(
    params: UsersSearchParams
  ): Promise<{ rows: UsersModel[]; count: number }> {
    return this.usersRepository.searchUsers(params);
  }

  public async getUserById(id: string): Promise<UsersModel | null> {
    return this.commonRepository.getUserById(id);
  }

  private async validateRequestModel(
    usersModel: UpsertUsersModel,
    id?: string
  ) {
    addLog(LogLevel.info, "validateRequestModel", usersModel);
    if (id) {
      const userExist = await this.commonRepository.getUserById(id);
      addLog(LogLevel.info, "userExist", userExist);

      if (!userExist) {
        const err = new Error();
        err.name = ErrorType.UserNotFound;
        return Promise.reject(err);
      }

      if (userExist.status !== UserStatusEnum.ACTIVE) {
        const err = new Error();
        err.name = ErrorType.UserIsInactive;
        return Promise.reject(err);
      }
    }

    const userEmailExist = await this.usersRepository.getUserByEmail(
      usersModel.email,
      id
    );

    if (userEmailExist) {
      const err = new Error();
      err.name = ErrorType.UserIsUnique;
      return Promise.reject(err);
    }

    const checkRoleExists = await this.commonRepository.getRoleById(
      usersModel.role
    );

    if (!checkRoleExists) {
      const err = new Error();
      err.name = ErrorType.RoleNotFound;
      return Promise.reject(err);
    }
    return true;
  }

  public async updateUserStatus(id: string): Promise<UpdateResult> {
    const userExist = await this.commonRepository.getUserById(id);

    if (!userExist) {
      const err = new Error();
      err.name = ErrorType.UserNotFound;
      return Promise.reject(err);
    }
    return this.commonRepository.updateUser(
      {
        status:
          userExist.status === UserStatusEnum.ACTIVE
            ? UserStatusEnum.IN_ACTIVE
            : UserStatusEnum.ACTIVE,
      } as UsersModel,
      id
    );
  }

  public async getUserBorrowHistory(id: string) {
    const userExist = await this.commonRepository.getUserById(id);

    if (!userExist) {
      const err = new Error();
      err.name = ErrorType.UserNotFound;
      return Promise.reject(err);
    }
    return this.usersRepository.getUserBorrowHistory(id);
  }
}
