import mongoose, { Document, model, Schema, Types } from "mongoose";
import { UserStatusEnum } from "../../enum";

export interface UsersModel extends Document {
  userName: string;
  email: string;
  password: string;
  role: Types.ObjectId;
  status: UserStatusEnum;
  lastLogin: Date;
  refreshToken?: string | null;
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
      enum: UserStatusEnum,
    },
    lastLogin: { type: Date },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

const Users = model<UsersModel>("users", UserSchema);
export default Users;
