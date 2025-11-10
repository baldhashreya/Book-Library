// {
//   _id, userId (ref: users), name, contactInfo: { phone, email, address }, status, createdAt, updatedAt
// }

import mongoose, { Document, model, Schema, Types } from "mongoose";

export interface membersModel extends Document {
  userId: Types.ObjectId;
  name: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  status: "Active" | "In-Active";
}

const memberSchema = new Schema<membersModel>(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "In-Active"],
    },
    contactInfo: {
      phone: { type: String },
      email: { type: String },
      address: { type: String },
    },
  },
  { timestamps: true }
);

const members = model<membersModel>("members", memberSchema);
export default members;
