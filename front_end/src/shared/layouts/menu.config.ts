import {
  LayoutDashboard,
  Book,
  ChartColumnStacked,
  Users,
  BookA,
} from "lucide-react";

export const MENU_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    roles: ["admin", "librarian", "member"],
  },
  {
    id: "book",
    label: "Book",
    icon: Book,
    path: "/books",
    roles: ["admin", "librarian", "member"],
  },
  {
    id: "category",
    label: "Category",
    icon: ChartColumnStacked,
    path: "/categories",
    roles: ["admin", "librarian"],
  },
  {
    id: "author",
    label: "Author",
    icon: BookA,
    path: "/author",
    roles: ["admin", "librarian"],
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    path: "/users",
    roles: ["admin", "librarian"],
  },
];
