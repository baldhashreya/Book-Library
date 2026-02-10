import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../features/login/pages/LoginMainPage";
import Signup from "../features/login/pages/Signup";
import DashboardPage from "../features/Dashboard/Dashboard";
import BookPage from "../features/books/pages/BookPage";
import CategoryPage from "../features/category/pages/CategoryPage";
import AuthorPage from "../features/author/pages/AuthorPage";
import UserPage from "../features/users/pages/UserPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import RolePage from "../features/role/Pages/RolePage";

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    {/* Protected */}
    <Route
      path="/dashboard"
      element={<ProtectedRoute element={<DashboardPage />} />}
    />
    <Route
      path="/books"
      element={<ProtectedRoute element={<BookPage />} />}
    />
    <Route
      path="/categories"
      element={
        <ProtectedRoute
          element={<CategoryPage />}
          roles={["admin", "librarian"]}
        />
      }
    />
    <Route
      path="/author"
      element={
        <ProtectedRoute
          element={<AuthorPage />}
          roles={["admin", "librarian"]}
        />
      }
    />
    <Route
      path="/users"
      element={
        <ProtectedRoute
          element={<UserPage />}
          roles={["admin", "librarian"]}
        />
      }
    />
    <Route
      path="/role"
      element={
        <ProtectedRoute
          element={<RolePage />}
          roles={["admin", "librarian"]}
        />
      }
    />
    <Route
      path="/about-me"
      element={<ProtectedRoute element={<ProfilePage />} />}
    />

    <Route path="/" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;
