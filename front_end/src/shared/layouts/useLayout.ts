// all role + active menu logic
import { useLocation } from "react-router-dom";
import { MENU_ITEMS } from "./menu.config";
import { useMemo } from "react";

export const useLayout = (role: string) => {
  const location = useLocation();

  const menuItems = useMemo(() => 
    MENU_ITEMS.filter((item) => item.roles.includes(role)),
    [role]
  );

  const activeMenu = useMemo(() => 
    menuItems.find((item) =>
      location.pathname.startsWith(item.path)
    )?.id || "dashboard",
    [menuItems, location.pathname]
  );

  return { menuItems, activeMenu };
};
