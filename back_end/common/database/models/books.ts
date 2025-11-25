import mongoose, { model, Schema, Types } from "mongoose";
import { BookStatusEnum } from "../../enum";

export interface BooksModel {
  title: string;
  author: Types.ObjectId | string;
  category: Types.ObjectId | string;
  isbn: string;
  publisher: number;
  quantity: number;
  issuedBook: number;
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
    publisher: { type: Number },
    quantity: { type: Number },
    description: { type: String },
    coverImage: { type: String },
    status: { type: String, enum: BookStatusEnum },
    issuedBook: { type: Number },
  },
  { timestamps: true }
);

const Books = model<BooksModel>("books", BooksSchema);
export default Books;
