module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    await db.collection('roles').insertMany([
      {
        name: "Admin",
        permissions: ["manage_users", "manage_books", "manage_roles", "view_reports", "issue_books", "return_books"],
        description: "Has full access to manage the entire library system."
      },
      {
        name: "Librarian",
        permissions: ["manage_books", "issue_books", "return_books", "view_reports"],
        description: "Manages day-to-day library operations such as issuing and returning books."
      },
      {
        name: "Member",
        permissions: ["view_books", "borrow_books", "view_borrow_history"],
        description: "Can view available books and borrow or return them."
      }
    ]);
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
   await db.collection('roles').deleteMany({
      name: { $in: ["Admin", "Librarian", "Member"] }
    });
  }
};
