export const isAuthenticated = () => localStorage.getItem("token") !== null;

export const getUserRole = (): string => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return String(user?.role?.name || "")
      .trim()
      .toLowerCase();
  } catch {
    return "";
  }
};
