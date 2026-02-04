// all role + active menu logic
import { useLocation } from "react-router-dom";
import { MENU_ITEMS } from "./menu.config";

export const useLayout = (role: string) => {
  const location = useLocation();

  const menuItems = MENU_ITEMS.filter((item) =>
    item.roles.includes(role)
  );

  const activeMenu =
    menuItems.find((item) =>
      location.pathname.startsWith(item.path)
    )?.id || "dashboard";

  return { menuItems, activeMenu };
};
