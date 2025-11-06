// {
//   _id, name, bio, birthDate, books: [ref]
// }

import mongoose, { model, Schema, Types } from "mongoose";

export interface authorModel {
  name: string;
  bio: string;
  birthdate: Date;
  books: [Types.ObjectId];
}

const authorSchema = new Schema<authorModel>({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  birthdate: { type: Date, required: true },
  books: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "books",
    },
  ],
});

const authors = model<authorModel>("authors", authorSchema);
export default authors;
