import mongoose, { Document, model, Schema, Types } from "mongoose";
import { UserStatusEnum } from "../../common-functions/enum";

export interface UsersModel extends Document {
  name:string
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
    name: { type: String, required: true },
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

export const Users = model<UsersModel>("users", UserSchema);
