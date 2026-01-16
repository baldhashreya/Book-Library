module.exports = {
  async up(db, client) {
    await db.collection("pages").insertMany([
      {
        name: "Dashboard",
        code: "DASHBOARD",
        url: "/dashboard",
        image: "/images/dashboard.png",
        display_order: 1,
        active: true,
        created_by: "system",
        modified_by: "system",
        shows_in_menu: true,
        translations: [
          {
            name: "Dashboard",
            language_code: "en",
          },
          {
            name: "Panel",
            language_code: "es",
          },
          {
            name: "Mælaborð",
            language_code: "is",
          },
        ],
        action: [
          {
            name: "View Dashboard",
            code: "VIEW_DASHBOARD",
            translations: [
              {
                name: "View Dashboard",
                language_code: "en",
              },
              {
                name: "Vistar panel",
                language_code: "es",
              },
              {
                name: "Skoða mælaborð",
                language_code: "is",
              },
            ],
          },
        ],
      },
      {
        name: "Books",
        code: "BOOKS",
        url: "/books",
        image: "/images/books.png",
        display_order: 2,
        active: true,
        created_by: "system",
        modified_by: "system",
        shows_in_menu: true,
        translations: [
          {
            name: "Books",
            language_code: "en",
          },
          { name: "Libros", language_code: "es" },
          {
            name: "Bækur",
            language_code: "is",
          },
        ],
        action: [
          {
            name: "View Books",
            code: "VIEW_BOOKS",
            translations: [
              { name: "View Books", language_code: "en" },
              {
                name: "Vistar libros",
                language_code: "es",
              },
              {
                name: "Skoða bækur",
                language_code: "is",
              },
            ],
          },
          {
            name: "Add Book",
            code: "ADD_BOOK",
            translations: [
              { name: "Add Book", language_code: "en" },
              { name: "Agregar libro", language_code: "es" },
              { name: "Bæta við bók", language_code: "is" },
            ],
          },
          {
            name: "Edit Book",
            code: "EDIT_BOOK",
            translations: [
              { name: "Edit Book", language_code: "en" },
              { name: "Editar libro", language_code: "es" },
              { name: "Breyta bók", language_code: "is" },
            ],
          },
          {
            name: "Delete Book",
            code: "DELETE_BOOK",
            translations: [
              { name: "Delete Book", language_code: "en" },
              { name: "Eliminar libro", language_code: "es" },
              { name: "Eyða bók", language_code: "is" },
            ],
          },
        ],
      },
      {
        name: "categories",
        code: "CATEGORIES",
        url: "/categories",
        image: "/images/categories.png",
        display_order: 3,
        active: true,
        created_by: "system",
        modified_by: "system",
        shows_in_menu: true,
        translations: [
          { name: "Categories", language_code: "en" },
          { name: "Categorías", language_code: "es" },
          { name: "Flokkar", language_code: "is" },
        ],
        action: [
          {
            name: "View Categories",
            code: "VIEW_CATEGORIES",
            translations: [
              { name: "View Categories", language_code: "en" },
              { name: "Vistar categorías", language_code: "es" },
              { name: "Skoða flokkar", language_code: "is" },
            ],
          },

          {
            name: "Add Category",
            code: "ADD_CATEGORY",
            translations: [
              { name: "Add Category", language_code: "en" },
              { name: "Agregar categoría", language_code: "es" },

              { name: "Bæta við flokki", language_code: "is" },
            ],
          },

          {
            name: "Edit Category",
            code: "EDIT_CATEGORY",
            translations: [
              { name: "Edit Category", language_code: "en" },
              { name: "Editar categoría", language_code: "es" },
              { name: "Breyta flokki", language_code: "is" },
            ],
          },
          {
            name: "Delete Category",
            code: "DELETE_CATEGORY",
            translations: [
              { name: "Delete Category", language_code: "en" },
              { name: "Eliminar categoría", language_code: "es" },
              { name: "Eyða flokki", language_code: "is" },
            ],
          },
        ],
      },
      {
        name: "users",
        code: "USERS",
        url: "/users",
        image: "/images/users.png",
        display_order: 4,
        active: true,
        created_by: "system",
        modified_by: "system",
        shows_in_menu: true,
        translations: [
          { name: "Users", language_code: "en" },
          { name: "Usuarios", language_code: "es" },
          { name: "Notendur", language_code: "is" },
        ],
        action: [
          {
            name: "View Users",
            code: "VIEW_USERS",
            translations: [
              { name: "View Users", language_code: "en" },
              { name: "Vistar usuarios", language_code: "es" },
              { name: "Skoða notendur", language_code: "is" },
            ],
          },
          {
            name: "Add User",
            code: "ADD_USER",
            translations: [
              { name: "Add User", language_code: "en" },
              { name: "Agregar usuario", language_code: "es" },
              { name: "Bæta við notanda", language_code: "is" },
            ],
          },
          {
            name: "Edit User",
            code: "EDIT_USER",
            translations: [
              { name: "Edit User", language_code: "en" },
              { name: "Editar usuario", language_code: "es" },
              { name: "Breyta notanda", language_code: "is" },
            ],
          },
          {
            name: "Delete User",
            code: "DELETE_USER",
            translations: [
              { name: "Delete User", language_code: "en" },
              { name: "Eliminar usuario", language_code: "es" },
              { name: "Eyða notanda", language_code: "is" },
            ],
          },
        ],
      },
    ]);
  },

  async down(db, client) {
    await db.collection("pages").deleteMany();
  },
};
