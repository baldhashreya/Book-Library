// {
//   _id, name, status, createdAt, updatedAt
// }

// | Column      | Description                                                     | Example                                |
// | ----------- | --------------------------------------------------------------- | -------------------------------------- |
// | `_id`       | Unique identifier for each category (MongoDB auto-generates it) | `ObjectId("6736b2f8c93d1b8c9f123456")` |
// | `name`      | The name of the category                                        | `"Science Fiction"`                    |
// | `status`    | Used to indicate if the category is active or inactive          | `"active"`                             |
// | `createdAt` | Timestamp when the category was created                         | `"2025-11-05T10:30:00Z"`               |
// | `updatedAt` | Timestamp when the category was last updated                    | `"2025-11-05T10:30:00Z"`               |

import { Document, model, Schema } from "mongoose";

export interface categoriesModel extends Document {
  name: string;
  status: "Active" | "In-Active";
}

const categoriesSchema = new Schema<categoriesModel>(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ["Active", "In-Active"], required: true  },
  },
  { timestamps: true }
);

const categories = model<categoriesModel>("categories", categoriesSchema);
export default categories;
