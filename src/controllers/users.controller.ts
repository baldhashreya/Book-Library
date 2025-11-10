import { baseController } from "../../common/base-controller";
import { UsersModel } from "../../common/database/models/users";
import { UsersOperations } from "../../common/enum";
import { logger } from "../../common/logger";
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
    logger.info("create User", req.body);
    const result = await this.usersServices.createUser(req.body);
    return baseController.getResult(res, 200, result, UsersOperations.CREATE);
  };

  public createUsers = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    logger.info("create Users", req.body);
    const result = await this.usersServices.createUsers();
    return baseController.getResult(
      res,
      200,
      result,
      UsersOperations.USERS_CREATED
    );
  };

  public updateUsers = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    logger.info("update User", req.body);
    const result = await this.usersServices.updateUser(
      req.body,
      req.params.id as string
    );
    return baseController.getResult(res, 200, result, UsersOperations.UPDATED);
  };
  public deleteUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    logger.info("delete User", req.body);
    const result = await this.usersServices.deleteUser(req.params.id as string);
    return baseController.getResult(res, 200, result, UsersOperations.DELETED);
  };

  public searchUsers = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    logger.info("search User", req.body);
    const result = await this.usersServices.searchUsers(req.body);
    return baseController.getResult(res, 200, result, UsersOperations.SEARCH);
  };

  public getUserById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    logger.info("get User", req.body);
    console.log(req.headers);
    console.log("url::::::::",(req.baseUrl + req.url));
    console.log("params::::::::",req.method);
    const result = await this.usersServices.getUserById(
      req.params.id as string
    );
    return baseController.getResult(res, 200, result, UsersOperations.GET);
  };

  public updateUserStatus = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    logger.info("update User Status", req.body);
    const result = await this.usersServices.updateUserStatus(
      req.params.id as string,
      req.body.status
    );
    return baseController.getResult(res, 200, result, UsersOperations.UPDATED);
  };
}
