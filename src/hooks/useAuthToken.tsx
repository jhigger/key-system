import { useAuth } from "@clerk/nextjs";

const useAuthToken = () => {
  const { getToken } = useAuth();
  return async () => await getToken({ template: "supabase" });
};

export default useAuthToken;
