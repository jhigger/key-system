import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "~/state/user.store";
import useUsers from "./useUsers";

export const useCurrentUser = () => {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { fetchUser } = useUsers();
  const { user, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(!user);

  const fetchUserData = useCallback(async () => {
    if (clerkUser && !user) {
      try {
        console.log("Fetching user data");
        setIsLoading(true);
        const fetchedUser = await fetchUser(clerkUser.id);
        if (fetchedUser) {
          console.log("User data fetched", fetchedUser);
          setUser(fetchedUser);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    } else if (clerkUser && user) {
      setIsLoading(false);
    }
  }, [user, clerkUser, fetchUser, setUser]);

  useEffect(() => {
    if (isClerkLoaded) {
      void fetchUserData();
    }
  }, [isClerkLoaded, fetchUserData]);

  return { user, isLoading: isLoading || !isClerkLoaded };
};
