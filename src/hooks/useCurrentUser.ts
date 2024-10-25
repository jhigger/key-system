import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getUserByClerkId } from "~/data-access/users";
import { useUIStore } from "~/state/ui.store";
import { useUserStore } from "~/state/user.store";
import useAuthToken from "./useAuthToken";

export const useCurrentUser = () => {
  const getToken = useAuthToken();
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { setUser } = useUserStore();
  const { setEditMode } = useUIStore();
  const [clerkId, setClerkId] = useState("");
  const {
    data: user,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ["user", clerkId],
    queryFn: () => getUserByClerkId(getToken, clerkId),
    enabled: !!clerkId,
    refetchOnReconnect: "always",
  });

  useEffect(() => {
    if (clerkUser) {
      setClerkId(clerkUser.id);
    }
  }, [clerkUser]);

  useEffect(() => {
    if (user) {
      setUser(user);
      if (user.role !== "admin") {
        setEditMode(false);
      }
    }
  }, [user, setUser, setEditMode]);

  useEffect(() => {
    if (isFetched && isSignedIn && !user) {
      window.location.reload();
    }
  }, [isFetched, isSignedIn, user]);

  return { user, isLoading: isLoading || !isClerkLoaded };
};
