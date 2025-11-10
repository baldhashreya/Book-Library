import { Request, Response } from "express";
import { RolesServices } from "../services/roles.service";
import { baseController } from "../../common/base-controller";
import { RoleOperations } from "../../common/enum";
import { logger } from "../../common/logger";

export class RolesController {
  constructor(private readonly rolesServices: RolesServices) {
    this.rolesServices = rolesServices;
  }

  public createRole = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    logger.info("create Role", req.body);
    const result = await this.rolesServices.createRole(req.body);
    return baseController.getResult(res, 200, result, RoleOperations.CREATE);
  };

  public updateRole = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    logger.info("update Role", req.body);
    const result = await this.rolesServices.updateRoleById(
      req.body,
      req.params.id as string
    );
    return baseController.getResult(res, 200, result, RoleOperations.UPDATE);
  };

  public deleteRole = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    logger.info("delete Role", req.body);
    const result = await this.rolesServices.deleteRoleById(
      req.params.id as string
    );
    return baseController.getResult(res, 200, result, RoleOperations.DELETE);
  };

  public getRoleById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    logger.info("get Role", req.body);
    const result = await this.rolesServices.getRoleById(
      req.params.id as string
    );
    return baseController.getResult(res, 200, result, RoleOperations.GET);
  };

  public searchRoles = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    logger.info("search Role", req.body);
    const result = await this.rolesServices.searchRoles(req.body);
    return baseController.getResult(res, 200, result, RoleOperations.SEARCH);
  };
}
