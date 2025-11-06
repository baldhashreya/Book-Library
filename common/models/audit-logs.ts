import mongoose, { Document, model, Schema, Types } from "mongoose";
import { AuditLogsActionEnum } from "../enum";

export interface auditLogsModel extends Document {
  action: AuditLogsActionEnum;
  performedBy: Types.ObjectId;
  targetType: string;
  targetId: string;
  details: string;
}

const auditLogsSchema = new Schema<auditLogsModel>({
  action: { type: String, required: true, enum: AuditLogsActionEnum },
  performedBy: { type: mongoose.Schema.ObjectId, required: true },
  targetType: { type: String, required: true },
  targetId: { type: String },
  details: { type: String },
});

const auditLogs = model<auditLogsModel>("audit_logs", auditLogsSchema);

export default auditLogs;

// | Field         | Description                                                   | Example Value                                                                          |
// | ------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
// | `_id`         | Unique ID for the log                                         | `"674f9b9a2a12c..."`                                                                   |
// | `action`      | The specific activity performed                               | `"CREATE_BOOK"`, `"UPDATE_MEMBER"`, `"DELETE_RECORD"`, `"ISSUE_BOOK"`, `"RETURN_BOOK"` |
// | `performedBy` | Reference to the user who did the action                      | `ObjectId("674c8b...")` → points to a user (Admin/Librarian)                           |
// | `targetType`  | What entity or module was affected                            | `"Book"`, `"Member"`, `"Reservation"`, `"Fine"`, `"Notification"`                      |
// | `targetId`    | The ID of the specific record changed                         | `ObjectId("6750aa...")` → e.g. ID of a book or member                                  |
// | `timestamp`   | When the action happened                                      | `new Date()`                                                                           |
// | `details`     | Optional — can store a JSON or string explaining what changed | `{"oldStatus": "borrowed", "newStatus": "returned"}`                                   |
