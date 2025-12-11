import Categories, {
  CategoriesModel,
} from "../../common/database/models/categories";
import { CategoriesSearchParams } from "../interface/common.interface";

export class CategoriesRepository {
  public async createCategory(
    params: CategoriesModel
  ): Promise<CategoriesModel> {
    return Categories.create(params);
  }

  public async getCategoryByName(name: string, id?: string): Promise<number> {
    if (id) {
      return Categories.countDocuments({ name, _id: { $ne: id } });
    }
    return Categories.countDocuments({ name });
  }

  public async updateCategory(
    id: string,
    params: Partial<CategoriesModel>
  ): Promise<CategoriesModel | null> {
    return Categories.findByIdAndUpdate({ _id: id }, params, { new: true });
  }

  public async deleteCategory(id: string): Promise<CategoriesModel | null> {
    return Categories.findByIdAndDelete({ _id: id });
  }

  public async searchCategory(
    params: CategoriesSearchParams
  ): Promise<{count: number, rows: CategoriesModel[]}> {
    let query = {};
    if (params.name) {
      query = { ...query, name: { $regex: params.name, $options: "i" } };
    }
    if (params.status) {
      query = { ...query, status: params.status };
    }

    let order = {};
    if (params.order && params.order.length && params.order[0]?.length) {
      let orderDirection = params.order[0][1] ? params.order[0][1] : "desc";
      let direction = orderDirection.toLowerCase() === "asc" ? 1 : -1;
      order = { [String(params.order[0][0])]: direction };
    } else {
      order = { name: -1 };
    }
    const count = await Categories.countDocuments(query);
    const rows  = await Categories.find(query)
      .sort(order)
      .skip(params.offset || 0)
      .limit(params.limit || 10);
    return {count, rows}
  }

  public async getCategoryById(id: string): Promise<CategoriesModel | null> {
    return Categories.findById({ _id: id });
  }

  public async createMoreCategories(
    params: CategoriesModel[]
  ): Promise<CategoriesModel[]> {
    return Categories.insertMany(params);
  }
}
