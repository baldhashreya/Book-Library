// | Column                   | Description                                | Example Values                                  |
// | ------------------------ | ------------------------------------------ | ----------------------------------------------- |
// | `bookId`                 | Reference to the borrowed book             | ObjectId("6750b1...")                           |
// | `memberId`               | Reference to the member who borrowed       | ObjectId("674f1c...")                           |
// | `issuedBy`               | Reference to the librarian/user who issued | ObjectId("674f1c...")                           |
// | `issueDate`              | When the book was issued                   | `"2025-10-25T10:00:00Z"`                        |
// | `dueDate`                | When it should be returned                 | `"2025-11-05T10:00:00Z"`                        |
// | `returnDate`             | When it was actually returned              | `"2025-10-19T15:30:00Z"` or `null`              |
// | `overdueDays`            | Days late                                  | `0`, `5`                                        |
// | `fine`                   | Fine amount                                | `0`, `50`                                       |
// | `status`                 | Current record status                      | `"issued"`, `"returned"`, `"lost"`, `"overdue"` |
// | `notes`                  | Optional remarks                           | `"Returned late"`, `"Damaged cover"`            |
// | `createdAt`, `updatedAt` | Timestamps for audit                       | `ISODate()`                                     |

import mongoose, { Document, model, Schema, Types } from "mongoose";
import { BorrowRecordsEnum } from "../../enum";
export interface BorrowRecordsModel extends Document {
  bookId: Types.ObjectId | string;
  issuedBy: Types.ObjectId | string;
  issueDate: Date;
  dueDate?: Date;
  returnDate?: Date;
  overdueDays?: number;
  fine?: number;
  status: BorrowRecordsEnum;
  notes?: string;
}

const BorrowRecordsSchema = new Schema<BorrowRecordsModel>(
  {
    bookId: {
      type: mongoose.Schema.ObjectId,
      ref: "books",
      required: true,
    },
    issuedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
    },
    returnDate: {
      type: Date,
    },
    overdueDays: { type: Number },
    fine: { type: Number },
    status: { type: String, required: true, enum: BorrowRecordsEnum },
    notes: { type: String },
  },
  { timestamps: true }
);

const BorrowRecords = model<BorrowRecordsModel>(
  "borrow_records",
  BorrowRecordsSchema
);

export default BorrowRecords;
