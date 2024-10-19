import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getUserByClerkId } from "~/data-access/users";
import { useUserStore } from "~/state/user.store";
import useAuthToken from "./useAuthToken";

export const useCurrentUser = () => {
  const getToken = useAuthToken();
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { setUser } = useUserStore();
  const [clerkId, setClerkId] = useState("");
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", clerkId],
    queryFn: () => getUserByClerkId(getToken, clerkId),
    enabled: !!clerkId,
  });

  useEffect(() => {
    if (clerkUser) {
      setClerkId(clerkUser.id);
    }
  }, [clerkUser]);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return { user, isLoading: isLoading || !isClerkLoaded };
};
