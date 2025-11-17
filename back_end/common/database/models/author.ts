import { model, Schema, Types } from "mongoose";

export interface AuthorModel {
  name: string;
  bio: string;
  birthDate: Date;
}

const authorSchema = new Schema<AuthorModel>({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  birthDate: { type: Date, required: true },
});

const Authors = model<AuthorModel>("authors", authorSchema);
export default Authors;
