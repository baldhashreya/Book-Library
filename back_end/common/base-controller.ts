import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { SuccessResponse } from "./interface";
import { getMessageByCode } from "./common-functions";
import { AuthOperations, HttpStatusCode, LogLevel } from "./enum";
import Users from "./database/models/users";
import { addLog } from "./logger";
export class ErrorResult {
  constructor(message: string, errorCode?: string, data?: unknown) {
    this.message = message;
    this.data = data;
    this.error_code = errorCode;
  }
  public message!: string;
  public error_code?: string | undefined;
  public data?: unknown;
}

class BaseController {
  public async getResult<T>(
    res: Response,
    code: HttpStatusCode,
    data: T,
    messageKey?: string
  ): Promise<Response> {
    let successObject: any;
    successObject = { data } as SuccessResponse;
    if (!messageKey) {
      delete successObject.message;
    } else {
      successObject.message = getMessageByCode(messageKey);
    }
    res.status(code).json(successObject);
    return res;
  }

  public getErrorResult(
    res: Response,
    code: HttpStatusCode,
    key: string,
    errorCode?: string
  ): Response {
    const result: ErrorResult = new ErrorResult(key, errorCode);
    return res.status(code).json(result);
  }
}

export const baseController = new BaseController();

export const authorizationUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  addLog(LogLevel.info, "authorizationUser", req.headers.authorization);
  const verifiedUser = jwt.verify(
    req.headers.authorization as string,
    process.env.ACCESS_TOKEN || ""
  );
  addLog(LogLevel.info, "verifiedUser", verifiedUser);
  const userId = verifiedUser && (verifiedUser as any)._id;
  if (!userId) {
    return baseController.getErrorResult(
      res,
      HttpStatusCode.BadRequest,
      getMessageByCode(AuthOperations.INVALID_CRED)
    );
  }
  const user = await Users.findById({ _id: userId });
  if (!user) {
    return baseController.getErrorResult(
      res,
      HttpStatusCode.BadRequest,
      getMessageByCode(AuthOperations.INVALID_CRED)
    );
  }
  (req as any).userId = userId;
  next();
};
