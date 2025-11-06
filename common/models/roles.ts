import { Document, model, Schema } from "mongoose";
import { RolePermission } from "../enum";

// | _id | name          | permissions                                                                                     | description                                                                |
// | --- | ------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
// | 1   | **Admin**     | ["manage_users", "manage_books", "manage_roles", "view_reports", "issue_books", "return_books"] | Has full access to manage the entire library system.                       |
// | 2   | **Librarian** | ["manage_books", "issue_books", "return_books", "view_reports"]                                 | Manages day-to-day library operations such as issuing and returning books. |
// | 3   | **Member**    | ["view_books", "borrow_books", "view_borrow_history"]                                           | Can view available books and borrow or return them.                        |

export interface RoleModel extends Document {
  name: string;
  permissions: RolePermission[];
  description: string;
}

const RoleSchema = new Schema<RoleModel>({
  name: {
    type: String,
    required: true,
  },
  permissions: [
    {
      type: String,
      required: true,
      enum: RolePermission,
    },
  ],
  description: {
    type: String,
    required: true,
  },
});

const Roles = model<RoleModel>("roles", RoleSchema);
export default Roles;
