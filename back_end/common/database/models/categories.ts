import { Document, model, Schema } from "mongoose";
import { UserStatusEnum } from "../../common-functions/enum";

export interface CategoriesModel extends Document {
  name: string;
  status: UserStatusEnum;
  description?: string;
}

const CategoriesSchema = new Schema<CategoriesModel>(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(UserStatusEnum),
      required: true,
    },
    description: { type: String },
  },
  { timestamps: true }
);

export const Categories = model<CategoriesModel>("categories", CategoriesSchema);
