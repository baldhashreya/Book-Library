import React, { type JSX } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./components/credentials/Login";
import Dashboard from "./components/Dashboard";
import BookPage from "./components/book/BookPage";
import CategoryPage from "./components/category/CategoryPage";
import UserPage from "./components/users/UserPage";
import RolePage from "./components/role/RolePage";
import AboutMePage from "./components/aboutMe/AboutMePage";
import "./App.css";

const isAuthenticated = () => {
  // return localStorage.getItem("token") !== null;
  return true;
};
const ProtectedRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const location = useLocation();
  const authenticated = isAuthenticated();

  if (!authenticated) {
    // Redirect to login and remember where the user wanted to go
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return element;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Route */}
          <Route
            path="/login"
            element={
              isAuthenticated() ? (
                <Navigate
                  to="/dashboard"
                  replace
                />
              ) : (
                <Login />
              )
            }
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
            element={<ProtectedRoute element={<CategoryPage />} />}
          />
          <Route
            path="/users"
            element={<ProtectedRoute element={<UserPage />} />}
          />
          <Route
            path="/roles"
            element={<ProtectedRoute element={<RolePage />} />}
          />
          <Route
            path="/about-me"
            element={<ProtectedRoute element={<AboutMePage />} />}
          />

          {/* Default redirect */}
          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
