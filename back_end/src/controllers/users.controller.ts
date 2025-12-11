import { baseController } from "../../common/base-controller";
import { HttpStatusCode, LogLevel, UsersOperations } from "../../common/enum";
import { addLog } from "../../common/logger";
import { UsersServices } from "../services/users.service";
import { Request, Response } from "express";

export class UsersControllers {
  constructor(private readonly usersServices: UsersServices) {
    this.usersServices = usersServices;
  }
  public createUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    addLog(LogLevel.info, "create User", req.body);
    const result = await this.usersServices.createUser(req.body);
    return baseController.getResult(res, HttpStatusCode.Ok, result, UsersOperations.CREATE);
  };

  public createUsers = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    addLog(LogLevel.info, "create Users", req.body);
    const result = await this.usersServices.createUsers();
    return baseController.getResult(
      res,
      HttpStatusCode.Ok,
      result,
      UsersOperations.USERS_CREATED
    );
  };

  public updateUsers = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    addLog(LogLevel.info, "update User", req.body);
    const result = await this.usersServices.updateUser(
      req.body,
      req.params.id as string
    );
    return baseController.getResult(res, HttpStatusCode.Ok, result, UsersOperations.UPDATED);
  };
  public deleteUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    addLog(LogLevel.info, "delete User", req.body);
    const result = await this.usersServices.deleteUser(req.params.id as string);
    return baseController.getResult(res, HttpStatusCode.Ok, result, UsersOperations.DELETED);
  };

  public searchUsers = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    addLog(LogLevel.info, "search User", req.body);
    const result = await this.usersServices.searchUsers(req.body);
    return baseController.getResult(res, HttpStatusCode.Ok, result, UsersOperations.SEARCH);
  };

  public getUserById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    addLog(LogLevel.info, "get User", req.body);
    const result = await this.usersServices.getUserById(
      req.params.id as string
    );
    return baseController.getResult(res, HttpStatusCode.Ok, result, UsersOperations.GET);
  };

  public updateUserStatus = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    addLog(LogLevel.info, "update User Status", req.body);
    const result = await this.usersServices.updateUserStatus(
      req.params.id as string
    );
    return baseController.getResult(res, HttpStatusCode.Ok, result, UsersOperations.UPDATED);
  };

  public getUserBorrowHistory = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    addLog(LogLevel.info, "update User Status", req.body);
    const result = await this.usersServices.getUserBorrowHistory(
      req.params.id as string
    );
    return baseController.getResult(res, HttpStatusCode.Ok, result, UsersOperations.UPDATED);
  };

}
