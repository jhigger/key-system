import { useUserStore } from "~/state/userStore";

const useTitle = () => {
  const { user } = useUserStore();
  const userRole = user?.role;

  return userRole === "admin"
    ? "Admin Panel"
    : userRole === "reseller"
      ? "Reseller Panel"
      : "User Panel";
};

export default useTitle;
