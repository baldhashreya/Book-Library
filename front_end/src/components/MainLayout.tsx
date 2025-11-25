import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Book,
  ChartColumnStacked,
  Users,
  LibraryBig,
  LogOut,
  User,
  BookA,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./MainLayout.css";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const getUserRole = () => {
    const stored = localStorage.getItem("user");
    if (!stored) return "";
    try {
      const parsed = JSON.parse(stored);
      return parsed?.role?.name?.toLowerCase() || "";
    } catch {
      return "";
    }
  };

  const role = getUserRole();

  const getActiveMenu = () => {
    if (location.pathname === "/dashboard") return "dashboard";
    if (location.pathname === "/books") return "book";
    if (location.pathname === "/categories") return "category";
    if (location.pathname === "/users") return "users";
    if (location.pathname === "/about-me") return "about-me";
    if (location.pathname === "/author") return "author";
    return "dashboard";
  };

  const [activeMenu, setActiveMenu] = useState(getActiveMenu());

  useEffect(() => {
    setActiveMenu(getActiveMenu());
  }, [location.pathname]);

  /** ------------------------------------
   * ROLE-BASED SIDEBAR CONTROL
   * ------------------------------------*/
  const allMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard />,
      path: "/dashboard",
      roles: ["admin", "librarian", "member"],
    },
    {
      id: "book",
      label: "Book",
      icon: <Book />,
      path: "/books",
      roles: ["admin", "librarian", "member"],
    },
    {
      id: "category",
      label: "Category",
      icon: <ChartColumnStacked />,
      path: "/categories",
      roles: ["admin", "librarian"],
    },
    {
      id: "author",
      label: "Author",
      icon: <BookA />,
      path: "/author",
      roles: ["admin", "librarian"],
    },
    {
      id: "users",
      label: "Users",
      icon: <Users />,
      path: "/users",
      roles: ["admin", "librarian"],
    },
  ];

  // Filter sidebar based on role
  const menuItems = allMenuItems.filter((item) => item.roles.includes(role));

  const handleMenuClick = (menuId: string, path: string) => {
    setActiveMenu(menuId);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("after logout");
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/about-me");
  };

  const currentUser = user ||
    JSON.parse(localStorage.getItem("user") || "{}") || {
      name: "User",
      email: "user@example.com",
    };

  return (
    <div className="main-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">
            <LibraryBig /> TatvaLib
          </h2>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeMenu === item.id ? "active" : ""}`}
              onClick={() => handleMenuClick(item.id, item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <span className="nav-icon">
              <LogOut />
            </span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </div>

      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <h1 className="page-title">
              {menuItems.find((item) => item.id === activeMenu)?.label ||
                "Dashboard"}
            </h1>
          </div>
          <div className="header-right">
            <button
              className="profile-btn"
              onClick={handleProfileClick}
            >
              <span className="profile-icon">
                <User />
              </span>
              <span className="profile-name">{currentUser.firstName || currentUser.userName}</span>
            </button>
          </div>
        </header>

        <main className="content-area">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
