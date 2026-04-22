import jwt from "jsonwebtoken";
import { AuthorizationRepository } from "../repositories/authorization.repository";
import { CommonRepository } from "../repositories/common.repository";
import { UpdateResult } from "mongoose";
import {
  hashPassword,
  verifyPassword,
  UsersModel,
  ErrorType,
  LogLevel,
  UserStatusEnum,
  addLog,
} from "common";

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

    const { password, ...userProfile } = existingUser.toObject();
    return { access_token, refresh_token, user: userProfile };
  }

  public async logOutUser(id: string): Promise<UpdateResult> {
    const mongoose = require("mongoose");
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
    id?: string,
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
    } catch (error) {
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
