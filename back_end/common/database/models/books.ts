// | Field         | Example Values                                               |
// | ------------- | ------------------------------------------------------------ |
// | `title`       | "The Alchemist", "Atomic Habits"                             |
// | `authors`     | Array of author IDs (e.g., `[ObjectId(...)]`)                |
// | `category`    | Ref to a category like "Fiction", "Self Help", "Programming" |
// | `isbn`        | `"9780061122415"`                                            |
// | `publisher`   | `"HarperCollins"`, `"Avery"`                                 |
// | `quantity`    | `5`, `3`, `10`                                               |
// | `description` | Summary of the book                                          |
// | `coverImage`  | URL or path string                                           |
// | `addedAt`     | Date when book was added                                     |
// | `updatedAt`   | Date when last updated                                       |
// | `status`      | `"available"`, `"checked_out"`, `"reserved"`, `"lost"`       |

import mongoose, { model, Schema, Types } from "mongoose";
import { BookStatusEnum } from "../../enum";

export interface BooksModel {
  title: string;
  author: Types.ObjectId;
  category: Types.ObjectId;
  isbn: string;
  publisher: string;
  quantity: number;
  description: string;
  coverImage: string;
  status: BookStatusEnum;
}

const BooksSchema = new Schema<BooksModel>(
  {
    title: { type: String, required: true },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "authors",
      required: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "categories",
      required: true,
    },
    isbn: { type: String },
    publisher: { type: String },
    quantity: { type: Number },
    description: { type: String },
    coverImage: { type: String },
    status: { type: String, enum: BookStatusEnum },
  },
  { timestamps: true }
);

const Books = model<BooksModel>("books", BooksSchema);
export default Books;
