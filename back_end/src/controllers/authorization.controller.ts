import { Request, Response } from "express";
import { AuthorizationServices } from "../services/authorization.service";
import { baseController } from "../../common/base-controller";
import { AuthOperations, LogLevel } from "../../common/enum";
import { addLog } from "../../common/logger";

export class AuthorizationController {
  constructor(private readonly authorizationServices: AuthorizationServices) {
    this.authorizationServices = authorizationServices;
  }

  public loginUser = async (req: Request, res: Response): Promise<Response> => {
    addLog(LogLevel.info, "login User", req.body);
    const result = await this.authorizationServices.loginUser(req.body);
    return baseController.getResult(res, 200, result, AuthOperations.LOGIN);
  };

  public logoutUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    addLog(LogLevel.info, "logout User", req.params.id);
    const result = await this.authorizationServices.logOutUser(req.params.id as string);
    return baseController.getResult(res, 200, result, AuthOperations.LOGOUT);
  };

  public signUpUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    addLog(LogLevel.info, "signUp User", req.body);
    const result = await this.authorizationServices.signUpUser(req.body);
    return baseController.getResult(res, 200, result, AuthOperations.SIGNUP);
  };

  public refreshToken = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    addLog(LogLevel.info, "refresh Token", req.body);
    const result = await this.authorizationServices.refreshToken(
      req.body.token,
      req.body.id
    );
    return baseController.getResult(
      res,
      200,
      result,
      AuthOperations.REFRESH_TOKEN
    );
  };

  public resetPassword = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    addLog(LogLevel.info, "reset Password", req.body);
    const result = await this.authorizationServices.resetPassword(
      req.body.password,
      req.params.id as string
    );
    return baseController.getResult(
      res,
      200,
      result,
      AuthOperations.RESET_PASSWORD
    );
  };
}
