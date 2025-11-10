import { Request, Response, NextFunction } from "express";
import argon2, { Options } from "argon2";
import { messages } from "./en";
import { ErrorStatusAndKey } from "./interface";
import { baseController } from "./base-controller";
import { logger } from "./logger";
import {
  RoleOperations,
  HttpStatusCode,
  ErrorType,
  AuthOperations,
  UsersOperations,
} from "./enum";

export function getMessageByCode(messageKey: string): string {
  switch (messageKey) {
    case RoleOperations.CREATE:
      return messages.RoleMessages.Create;
    case RoleOperations.UPDATE:
      return messages.RoleMessages.Update;
    case RoleOperations.SEARCH:
      return messages.RoleMessages.Search;
    case RoleOperations.GET:
      return messages.RoleMessages.Get;
    case RoleOperations.DELETE:
      return messages.RoleMessages.Delete;

    case UsersOperations.USERS_CREATED:
      return messages.UsersMessages.UsersCreated;
    case UsersOperations.UPDATED:
      return messages.UsersMessages.Updated;
    case UsersOperations.DELETED:
      return messages.UsersMessages.Deleted;
    case UsersOperations.SEARCH:
      return messages.UsersMessages.UsersFetched;
    case UsersOperations.CREATE:
      return messages.UsersMessages.create;

    case AuthOperations.LOGIN:
      return messages.AuthorizationsMessages.LoginSuccess;
    case AuthOperations.LOGOUT:
      return messages.AuthorizationsMessages.LogoutSuccess;
    case AuthOperations.SIGNUP:
      return messages.AuthorizationsMessages.SignupSuccess;
    case AuthOperations.REFRESH_TOKEN:
      return messages.AuthorizationsMessages.RefreshToken;
    case AuthOperations.RESET_PASSWORD:
      return messages.AuthorizationsMessages.PasswordUpdate;

    default:
      return "";
  }
}

export async function getErrorResult(error: Error): Promise<ErrorStatusAndKey> {
  const Error_name: string =
    error.name === ErrorType.SequelizeDatabaseError
      ? error.message
      : error.name;

  let statusCode: number = HttpStatusCode.InternalServerError;
  let errorKey: string = ErrorType.InternalServerError;
  let errorCode: string = Error_name;
  switch (Error_name) {
    case ErrorType.NotFound:
      statusCode = HttpStatusCode.NotFound;
      errorKey = messages.internalServerError;
      break;
    case ErrorType.BadRequest:
      statusCode = HttpStatusCode.BadRequest;
      errorKey = messages.badRequest;
      break;
    case ErrorType.Unauthorized:
      statusCode = HttpStatusCode.Unauthorized;
      errorKey = messages.unauthorized;
      break;
    case ErrorType.RoleNotFound:
      statusCode = HttpStatusCode.NotFound;
      errorKey = messages.RoleMessages.NotFound;
      break;
    case ErrorType.RoleIsUnique:
      statusCode = HttpStatusCode.ConflictError;
      errorKey = messages.RoleMessages.RoleIsUnique;
      break;
    case ErrorType.UserNotFound:
      statusCode = HttpStatusCode.NotFound;
      errorKey = messages.UsersMessages.UserNotFound;
      break;
    case ErrorType.UserIsUnique:
      statusCode = HttpStatusCode.ConflictError;
      errorKey = messages.UsersMessages.UserIsUnique;
      break;
    case ErrorType.UserIsInactive:
      statusCode = HttpStatusCode.Forbidden;
      errorKey = messages.UsersMessages.UserIsInactive;

    case ErrorType.InvalidCredentials:
      statusCode = HttpStatusCode.Unauthorized;
      errorKey = messages.AuthorizationsMessages.InvalidCredentials;
      break;

    default:
      statusCode = HttpStatusCode.InternalServerError;
      errorKey = messages.internalServerError;
      break;
  }
  return { statusCode, errorKey, errorCode } as ErrorStatusAndKey;
}

export const errorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  if (res.headersSent) {
    return next(err);
  }

  const errorResult = (await getErrorResult(err)) as ErrorStatusAndKey;

  return baseController.getErrorResult(
    res,
    errorResult.statusCode,
    errorResult.errorKey,
    errorResult.errorCode
  );
};

const argon2Options: Options & { raw?: false } = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 3,
  parallelism: 1,
};

export async function hashPassword(password: string): Promise<string> {
  logger.info("hashPassword", password);
  try {
    const hashedpassword = await argon2.hash(password, argon2Options);
    logger.info("hashedpassword", hashedpassword);
    return hashedpassword;
  } catch (err) {
    logger.error("Password hashing error:", err);
    return "";
  }
}

export async function verifyPassword(
  hash: string,
  plainPassword: string
): Promise<boolean> {
  try {
    return await argon2.verify(hash, plainPassword);
  } catch (error) {
    logger.error("Password verification error:", error);
    return false;
  }
}
