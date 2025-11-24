import mongoose, { Document, model, Schema, Types } from "mongoose";
import { UserStatusEnum } from "../../enum";

export interface UsersModel extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: Types.ObjectId;
  status: UserStatusEnum;
  lastLogin?: Date;
  refreshToken?: string | null;
  contactInfo: {
    phone: string;
    address: string;
  };
}

const UserSchema = new Schema<UsersModel>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
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
    contactInfo: {
      phone: { type: String },
      address: { type: String },
    },
  },
  { timestamps: true }
);

const Users = model<UsersModel>("users", UserSchema);
export default Users;
