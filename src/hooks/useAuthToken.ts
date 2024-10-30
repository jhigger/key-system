import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

const useAuthToken = (): (() => Promise<string | null>) => {
  const { getToken } = useAuth();

  const fetchToken = useCallback(async (): Promise<string | null> => {
    try {
      const token = await getToken({ template: "supabase" });
      return token;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  }, [getToken]);

  return fetchToken;
};

export default useAuthToken;
