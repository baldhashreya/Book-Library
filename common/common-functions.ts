import { Request, Response, NextFunction } from "express";
import argon2, { Options } from "argon2";
import { messages } from "./en";
import {
  AuthOperation,
  ErrorStatusAndKey,
  ErrorType,
  HttpStatusCode,
} from "./interface";
import { baseController } from "./base-controller";
import { logger } from "./logger";

export function getMessageByCode(messageKey: string): string {
  switch (messageKey) {
    case AuthOperation.LOGIN:
      return messages.AuthorizationsMessages.LoginSuccess;
    case AuthOperation.LOGOUT:
      return messages.AuthorizationsMessages.LogoutSuccess;
    case AuthOperation.SIGNUP:
      return messages.AuthorizationsMessages.SignupSuccess;
    case AuthOperation.INVALID_CRED:
      return messages.AuthorizationsMessages.InvalidCredentials;
    case AuthOperation.PASSWORD_UPDATE:
      return messages.AuthorizationsMessages.PasswordUpdate;
    case AuthOperation.USER_DETAILS:
      return messages.AuthorizationsMessages.UserDetails;
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
  return argon2.hash(password, argon2Options);
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
