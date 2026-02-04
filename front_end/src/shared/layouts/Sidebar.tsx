import React from "react";
import { LibraryBig } from "lucide-react";
import "./Sidebar.css"
import LogoutIcon from "@mui/icons-material/Logout";

interface SidebarProps {
  menuItems: any[];
  activeMenu: string;
  onNavigate: (id: string, path: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  activeMenu,
  onNavigate,
  onLogout,
}) => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <LibraryBig size={22} />
        <span>TatvaLib</span>
      </div>

      <nav className="menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id, item.path)}
              className={`menu-item ${
                activeMenu === item.id ? "active" : ""
              }`}
            >
              <Icon />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="logout" onClick={onLogout}>
        <LogoutIcon />
        <span>Logout</span>
      </div>
    </aside>
  );
};

export default Sidebar;
