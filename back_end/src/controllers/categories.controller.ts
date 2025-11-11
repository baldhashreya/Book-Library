import { Request, Response } from "express";
import { CategoriesService } from "../services/categories.service";
import { baseController } from "../../common/base-controller";
import {
  CategoriesOperations,
  HttpStatusCode,
  LogLevel,
} from "../../common/enum";
import { addLog } from "../../common/logger";

export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {
    this.categoriesService = categoriesService;
  }

  public createCategory = async (req: Request, res: Response) => {
    addLog(LogLevel.info, "Create Category Request Body:", req.body);
    const result = await this.categoriesService.createCategory(req.body);
    return baseController.getResult(
      res,
      HttpStatusCode.Ok,
      result,
      CategoriesOperations.CREATE
    );
  };
  public updateCategory = async (req: Request, res: Response) => {
    addLog(LogLevel.info, "Update Category Request Body:", req.body);
    const result = await this.categoriesService.updateCategory(
      req.params.id as string,
      req.body
    );
    return baseController.getResult(
      res,
      HttpStatusCode.Ok,
      result,
      CategoriesOperations.UPDATED
    );
  };
  public deleteCategory = async (req: Request, res: Response) => {
    addLog(LogLevel.info, "Delete Category Request Body:", req.body);
    const result = await this.categoriesService.deleteCategory(
      req.params.id as string
    );
    return baseController.getResult(
      res,
      HttpStatusCode.Ok,
      result,
      CategoriesOperations.DELETED
    );
  };
  public searchCategory = async (req: Request, res: Response) => {
    addLog(LogLevel.info, "Search Category Request Body:", req.body);
    const result = await this.categoriesService.searchCategory(req.body);
    return baseController.getResult(
      res,
      HttpStatusCode.Ok,
      result,
      CategoriesOperations.SEARCH
    );
  };

  public getCategoryById = async (req: Request, res: Response) => {
    addLog(LogLevel.info, "Get Category By ID Request Params:", req.params);
    const result = await this.categoriesService.getCategoryById(
      req.params.id as string
    );
    return baseController.getResult(
      res,
      HttpStatusCode.Ok,
      result,
      CategoriesOperations.SEARCH
    );
  };

  public createMoreCategories = async (req: Request, res: Response) => {
    addLog(LogLevel.info, "Create More Categories Request Body:", req.body);
    const result = await this.categoriesService.createMoreCategories(req.body);
    return baseController.getResult(
      res,
      HttpStatusCode.Ok,
      result,
      CategoriesOperations.CREATE
    );
  };
}
