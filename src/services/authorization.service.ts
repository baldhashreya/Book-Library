import jwt from "jsonwebtoken";
import { UsersModel } from "../../common/database/models/users";
import { AuthorizationRepository } from "../repositories/authorization.repository";
import { UsersServices } from "./users.service";
import { ErrorType, LogLevel, UserStatusEnum } from "../../common/enum";
import { CommonRepository } from "../repositories/common.repository";
import { UpdateResult } from "mongoose";
import { hashPassword, verifyPassword } from "../../common/common-functions";
import { addLog } from "../../common/logger";

export class AuthorizationServices {
  constructor(
    private readonly authorizationRepository: AuthorizationRepository,
    private readonly commonRepository: CommonRepository,
    private readonly usersService: UsersServices
  ) {
    this.authorizationRepository = authorizationRepository;
    this.commonRepository = commonRepository;
    this.usersService = usersService;
  }

  public async signUpUser(params: UsersModel): Promise<UsersModel> {
    const usersModel = await this.usersService.createUser(params);
    return usersModel;
  }

  public async loginUser(
    params: UsersModel
  ): Promise<{ access_token: string; refresh_token: string } | any> {
    const existingUser = await this.authorizationRepository.getUserByEmail(
      params.email
    );
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
      existingUser.password,
      params.password
    );
    if (!passwordVerified) {
      const err = new Error();
      err.name = ErrorType.UserIsInactive;
      return Promise.reject(err);
    }

    const access_token = jwt.sign(
      { _id: existingUser._id, email: existingUser.email },
      process.env.ACCESS_TOKEN || "",
      { expiresIn: "5m" }
    );

    const refresh_token = jwt.sign(
      { _id: existingUser._id, email: existingUser.email },
      process.env.REFRESH_TOKEN || "",
      { expiresIn: "30m" }
    );

    await this.commonRepository.updateUser(
      { refreshToken: refresh_token, lastLogin: new Date() } as UsersModel,
      existingUser._id as unknown as string
    );

    return { access_token, refresh_token };
  }

  public async logOutUser(id: string): Promise<UpdateResult> {
    const existingUser = await this.commonRepository.getUserById(id);
    if (!existingUser) {
      const err = new Error();
      err.name = ErrorType.UserNotFound;
      return Promise.reject(err);
    }
    return this.commonRepository.updateUser(
      { refreshToken: null } as UsersModel,
      existingUser._id as unknown as string
    );
  }

  public async refreshToken(
    token: string,
    id: string
  ): Promise<{ refresh_token: string; access_token: string }> {
    const existingUser = await this.commonRepository.getUserById(id);
    if (!existingUser) {
      const err = new Error();
      err.name = ErrorType.UserNotFound;
      return Promise.reject(err);
    }

    const access_token = jwt.sign(
      { _id: existingUser._id, email: existingUser.email },
      process.env.ACCESS_TOKEN || "",
      { expiresIn: "5m" }
    );

    const refresh_token = jwt.sign(
      { _id: existingUser._id, email: existingUser.email },
      process.env.REFRESH_TOKEN || "",
      { expiresIn: "30m" }
    );

    return { access_token, refresh_token };
  }

  public async resetPassword(
    password: string,
    id: string
  ): Promise<UpdateResult | any> {
    const existingUser = await this.commonRepository.getUserById(id);
    if (!existingUser) {
      const err = new Error();
      err.name = ErrorType.UserNotFound;
      return Promise.reject(err);
    }
    const hashedPassword = await hashPassword(password);
    addLog(LogLevel.info, "hashedPassword", hashedPassword);
    return this.commonRepository.updateUser(
      { password: hashedPassword } as UsersModel,
      existingUser._id as unknown as string
    );
  }
}
