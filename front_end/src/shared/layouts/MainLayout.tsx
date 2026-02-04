import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./MainLayout.css";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useLayout } from "./useLayout";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const role = stored?.role?.name?.toLowerCase() || "";
  const userName = user?.name || stored?.name || "User";

  const { menuItems, activeMenu } = useLayout(role);

  const handleMenuClick = (id: string, path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const title =
    menuItems.find((item) => item.id === activeMenu)?.label || "Dashboard";

  return (
    <div className="layout">
      <Sidebar
        menuItems={menuItems}
        activeMenu={activeMenu}
        onNavigate={handleMenuClick}
        onLogout={handleLogout}
      />

      <div className="right">
        <Topbar
          title={title}
          userName={userName}
          onProfile={() => navigate("/about-me")}
        />

        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
