import mongoose, { Document, model, Schema, Types } from "mongoose";

export interface UsersModel extends Document {
  userName: string;
  email: string;
  password: string;
  role: Types.ObjectId;
  status: "Active" | "In-Active";
  lastLogin: Date;
}

const UserSchema = new Schema<UsersModel>(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: mongoose.Schema.ObjectId,
      ref: "roles",
    },
    status: {
      type: String,
      enum: ["Active", "In-Active"],
    },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

const Users = model<UsersModel>("users", UserSchema);
export default Users;
