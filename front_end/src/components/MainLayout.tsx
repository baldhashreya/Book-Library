import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Book,
  ChartColumnStacked,
  Users,
  LibraryBig,
  BookA,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./MainLayout.css";
import CustomButton from "./common/Button/CustomButton";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

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
            <CustomButton
              variant="text"
              onClick={() => handleMenuClick(item.id, item.path)}
              label={item.label}
              className={`nav-item ${activeMenu === item.id ? "active" : ""}`}
              startIcon={item.icon}
            />
          ))}
        </nav>

        <div className="sidebar-footer">
          <CustomButton
            variant="text"
            onClick={handleLogout}
            label="Logout"
            className="logout-btn"
            startIcon={<LogoutIcon />}
          />
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
            <CustomButton
              variant="outlined"
              onClick={handleProfileClick}
              label={currentUser.name || currentUser.userName}
              className="profile-btn"
              startIcon={<PersonOutlineIcon />}
            />
          </div>
        </header>

        <main className="content-area">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
