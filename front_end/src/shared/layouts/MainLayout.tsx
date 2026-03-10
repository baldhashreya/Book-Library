import React from "react";
import { useNavigate } from "react-router-dom";
import "./MainLayout.css";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useLayout } from "./useLayout";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const storedUserStr = localStorage.getItem("user");
  const user = storedUserStr ? JSON.parse(storedUserStr) : null;
  
  console.log("MainLayout - user:", user);
  const role = user?.role?.name?.toLowerCase() || "";
  const userName = user?.name || user?.userName || "User";

  const { menuItems, activeMenu } = useLayout(role);
  console.log("MainLayout - role:", role);
  console.log("MainLayout - menuItems:", menuItems);
  console.log("MainLayout - activeMenu:", activeMenu);
  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
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
        onNavigate={(path) => handleMenuClick(path)}
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
