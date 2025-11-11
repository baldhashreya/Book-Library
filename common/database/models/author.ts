import { model, Schema, Types } from "mongoose";

export interface authorModel {
  name: string;
  bio: string;
  birthdate: Date;
}

const authorSchema = new Schema<authorModel>({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  birthdate: { type: Date, required: true },
});

const authors = model<authorModel>("authors", authorSchema);
export default authors;
