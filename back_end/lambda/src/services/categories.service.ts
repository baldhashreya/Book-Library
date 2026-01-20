import { ErrorType, UserStatusEnum, CategoriesModel } from "common";
import { CategoriesSearchParams } from "../interface/common.interface";
import { CategoriesRepository } from "../repositories/categories.repository";

export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {
    this.categoriesRepository = categoriesRepository;
  }

  public async createCategory(
    params: CategoriesModel,
  ): Promise<CategoriesModel> {
    const existingCategory = await this.categoriesRepository.getCategoryByName(
      params.name,
    );
    if (existingCategory) {
      const err = new Error();
      err.name = ErrorType.CategoryIsUnique;
      return Promise.reject(err);
    }
    return this.categoriesRepository.createCategory({
      ...params,
      status: UserStatusEnum.ACTIVE,
    } as CategoriesModel);
  }

  public async updateCategory(
    id: string,
    params: CategoriesModel,
  ): Promise<CategoriesModel> {
    const existingCategory = await this.categoriesRepository.getCategoryByName(
      params.name,
      id,
    );

    if (existingCategory) {
      const err = new Error();
      err.name = ErrorType.CategoryIsUnique;
      return Promise.reject(err);
    }
    const categoriesModel = await this.categoriesRepository.updateCategory(
      id,
      params,
    );

    if (!categoriesModel) {
      const err = new Error();
      err.name = ErrorType.CategoryNotFound;
      return Promise.reject(err);
    }
    return categoriesModel;
  }

  public async deleteCategory(id: string): Promise<CategoriesModel> {
    const categoriesModel = await this.categoriesRepository.deleteCategory(id);
    if (!categoriesModel) {
      const err = new Error();
      err.name = ErrorType.CategoryNotFound;
      return Promise.reject(err);
    }
    return categoriesModel;
  }

  public async searchCategory(
    params: CategoriesSearchParams,
  ): Promise<{ count: number; rows: CategoriesModel[] }> {
    return this.categoriesRepository.searchCategory(params);
  }

  public async getCategoryById(id: string): Promise<CategoriesModel | null> {
    return this.categoriesRepository.getCategoryById(id);
  }

  public async createMoreCategories(params: {
    name: string[];
  }): Promise<CategoriesModel[]> {
    let data: CategoriesModel[] = [];
    for (let i = 0; i < params.name.length; i++) {
      data.push({
        name: params.name[i],
        status: UserStatusEnum.ACTIVE,
      } as CategoriesModel);
    }
    return this.categoriesRepository.createMoreCategories(data);
  }
}
