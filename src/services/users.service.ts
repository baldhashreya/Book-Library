import { Types, UpdateResult } from "mongoose";
import { UsersModel } from "../../common/database/models/users";
import { ErrorType, UserStatusEnum } from "../../common/enum";
import { UsersSearchParams } from "../interface/users.interface";
import { CommonRepository } from "../repositories/common.repository";
import { UsersRepository } from "../repositories/users.repository";
import { hashPassword } from "../../common/common-functions";
import { logger } from "../../common/logger";
import fs from "fs";
import path from "path";

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
      logger.info("Users Model", data);
      await this.usersRepository.createUsers(data);
    } catch (err) {
      console.error(err);
    }
  }

  public async createUser(params: UsersModel): Promise<UsersModel> {
    await this.validateRequestModel(params);
    if (params.password) {
      params.password = await hashPassword(params.password);
    }
    return this.usersRepository.createUser({
      ...params,
      status: UserStatusEnum.ACTIVE,
    } as UsersModel);
  }

  public async updateUser(
    params: UsersModel,
    id: string
  ): Promise<UpdateResult> {
    await this.validateRequestModel(params, id);
    return this.commonRepository.updateUser(params, id);
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

  public async searchUsers(params: UsersSearchParams): Promise<UsersModel[]> {
    return this.usersRepository.searchUsers(params);
  }

  public async getUserById(id: string): Promise<UsersModel | null> {
    return this.commonRepository.getUserById(id);
  }

  private async validateRequestModel(usersModel: UsersModel, id?: string) {
    if (id) {
      const userExist = await this.commonRepository.getUserById(id);

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

  public async updateUserStatus(
    id: string,
    status: UserStatusEnum
  ): Promise<UpdateResult> {
    const userExist = await this.commonRepository.getUserById(id);

    if (!userExist) {
      const err = new Error();
      err.name = ErrorType.UserNotFound;
      return Promise.reject(err);
    }
    return this.commonRepository.updateUser({ status } as UsersModel, id);
  }
}
