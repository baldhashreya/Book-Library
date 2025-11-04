import { NextFunction, Request, Response } from "express";
import { AuthOperation, HttpStatusCode, SuccessResponse } from "./interface";
import { getMessageByCode } from "./common-functions";
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
  const userId = req.headers.userid;
  if (!userId) {
    return baseController.getErrorResult(
      res,
      HttpStatusCode.BadRequest,
      getMessageByCode(AuthOperation.INVALID_CRED)
    );
  }
  // const user = await Users.findById({ _id: userId });
  // if (!user) {
  //   return baseController.getErrorResult(
  //     res,
  //     HttpStatusCode.BadRequest,
  //     getMessageByCode(AuthOperation.INVALID_CRED)
  //   );
  // }
  next();
};
