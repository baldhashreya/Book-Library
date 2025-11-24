import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Login from "./components/credentials/Login";
import Signup from "./components/credentials/Signup";
import Dashboard from "./components/Dashboard";
import BookPage from "./components/book/BookPage";
import CategoryPage from "./components/category/CategoryPage";
import UserPage from "./components/users/UserPage";
import AboutMePage from "./components/aboutMe/AboutMePage";
import AuthorPage from "./components/Author/AuthorPage";
import "./App.css";

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

const getUserRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user?.role?.name || "";

    return String(role).trim().toLowerCase();
  } catch {
    return "";
  }
};

const ProtectedRoute: React.FC<{ element: JSX.Element; roles?: string[] }> = ({
  element,
  roles,
}) => {
  const location = useLocation();
  const auth = isAuthenticated();
  // user not logged in?
  if (!auth) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  const userRole = getUserRole();
  console.log("User Role:", userRole);
  if (roles && !roles.includes(userRole)) {
    console.log("Access Denied. Allowed:", roles);
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return element;
};

// ---------------- APP ----------------
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
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
          path="/about-me"
          element={<ProtectedRoute element={<AboutMePage />} />}
        />

        {/* Default */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
