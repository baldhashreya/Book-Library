import { Document, model, Schema } from "mongoose";
import { UserStatusEnum } from "../../enum";

export interface CategoriesModel extends Document {
  name: string;
  status: UserStatusEnum;
}

const CategoriesSchema = new Schema<CategoriesModel>(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(UserStatusEnum),
      required: true,
    },
  },
  { timestamps: true }
);

const Categories = model<CategoriesModel>("categories", CategoriesSchema);
export default Categories;
