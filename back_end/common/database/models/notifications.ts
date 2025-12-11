import mongoose, { Document, model, Schema, Types } from "mongoose";
import { NotificationType } from "../../common-functions/enum";

export interface NotificationsModel extends Document {
  member: Types.ObjectId;
  type: NotificationType;
  message: string;
  is_read: boolean;
}

const NotificationsSchema = new Schema<NotificationsModel>({
  member: { type: mongoose.Schema.ObjectId, ref: "users", required: true },
  type: {
    type: String,
    enum: NotificationType,
    required: true,
  },
  message: {
    type: String,
  },
  is_read: {
    type: Boolean,
  },
});

export const Notifications = model<NotificationsModel>(
  "notifications",
  NotificationsSchema
);
