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
import { BookStatusEnum } from "../enum";

export interface booksModel {
  title: string;
  authors: [Types.ObjectId];
  category: Types.ObjectId;
  isbn: string;
  publisher: string;
  quantity: number;
  description: string;
  coverImage: string;
  status: BookStatusEnum;
}

const booksSchema = new Schema<booksModel>(
  {
    title: { type: String, required: true },
    authors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "authors",
        required: true,
      },
    ],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "categories",
      required: true,
    },
    isbn: { type: String, required: true },
    publisher: { type: String, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    coverImage: { type: String },
    status: { type: String, required: true , enum: BookStatusEnum},
  },
  { timestamps: true }
);

const books = model<booksModel>("books", booksSchema);
export default books;
