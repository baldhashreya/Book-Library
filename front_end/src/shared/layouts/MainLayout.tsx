import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./MainLayout.css";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useLayout } from "./useLayout";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  console.log("MainLayout Render");
  const navigate = useNavigate();
  
  const user = useMemo(() => {
    const storedUserStr = localStorage.getItem("user");
    return storedUserStr ? JSON.parse(storedUserStr) : null;
  }, []);

  const role = useMemo(() => user?.role?.name?.toLowerCase() || "", [user]);
  const userName = useMemo(() => user?.name || user?.userName || "User", [user]);

  const { menuItems, activeMenu } = useLayout(role);

  const handleMenuClick = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/login");
  }, [navigate]);

  const handleProfile = useCallback(() => {
    navigate("/about-me");
  }, [navigate]);

  const title = useMemo(() => 
    menuItems.find((item) => (item.id === activeMenu))?.label || "Dashboard",
    [menuItems, activeMenu]
  );

  const filteredMenuItems = useMemo(() => 
    menuItems.filter((item) => item.showInPage),
    [menuItems]
  );

  return (
    <div className="layout">
      <Sidebar
        menuItems={filteredMenuItems}
        activeMenu={activeMenu}
        onNavigate={handleMenuClick}
        onLogout={handleLogout}
      />

      <div className="right">
        <Topbar
          title={title}
          userName={userName}
          onProfile={handleProfile}
        />

        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
