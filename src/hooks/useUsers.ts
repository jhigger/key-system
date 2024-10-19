import { useClerk } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { toast } from "sonner";
import {
  addUser,
  changeUserRole,
  getUserByClerkId,
  getUsers,
} from "~/data-access/users";
import { type UserType } from "~/types/user";
import useAuthToken from "./useAuthToken";

const useUsers = () => {
  const getToken = useAuthToken();
  const { setActive } = useClerk();
  const queryClient = useQueryClient();
  const router = useRouter();

  const query = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(getToken),
  });

  const changeRoleMutation = useMutation({
    mutationFn: async (user: UserType) => {
      return changeUserRole(getToken, user);
    },
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData<UserType[]>(["users"]);

      // Return a context object with the snapshotted value
      return { previousUsers };
    },
    onError: (err, newUser, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
      toast.error("Failed to change user role");
    },
    onSettled: async () => {
      // Always refetch after error or success
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onSuccess: (newUser) => {
      // Optimistically update to the new value
      queryClient.setQueryData<UserType[]>(["users"], (old) => {
        if (!old) return [newUser];
        return old.map((user) => (user.uuid === newUser.uuid ? newUser : user));
      });
      toast.success("User role updated successfully");
    },
  });

  const addUserMutation = useMutation({
    mutationFn: (user: UserType) => addUser(getToken, user),
    onSuccess: (newUser) => {
      queryClient.setQueryData<UserType[]>(["users"], (old) => {
        if (!old) return [newUser];
        return [...old, newUser];
      });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const setSession = async (sessionId: string | null) => {
    await setActive({ session: sessionId });
    await router.push("/");
  };

  const fetchUser = async (clerkId: string) => {
    const user = await getUserByClerkId(getToken, clerkId);
    if (user) {
      queryClient.setQueryData(["user", clerkId], user);
    }
    return user;
  };

  return {
    query,
    mutation: {
      changeRole: changeRoleMutation.mutate,
      addUser: addUserMutation.mutate,
    },
    setSession,
    fetchUser,
  };
};

export default useUsers;
