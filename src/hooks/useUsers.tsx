import { useClerk } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  addUser,
  changeUserRole,
  getUserByClerkId,
  getUsers,
} from "~/data-access/users";
import { useUserStore } from "~/state/user.store";
import { type UserType } from "~/types/user";

const useUsers = () => {
  const { client, setActive, signOut } = useClerk();
  const { setUser } = useUserStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const changeRoleMutation = useMutation({
    mutationFn: async (user: UserType) => {
      return changeUserRole(user);
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
    mutationFn: addUser,
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

  const setClerkUser = async (
    sessionId: string | null,
    values: { username: string; email: string } | undefined,
  ) => {
    const user = client.activeSessions[0]?.user;
    if (!user) {
      toast.error("User not found");
      return;
    }

    const userByClerkId = await getUserByClerkId(user.id).catch(async () => {
      if (!values?.username || !values?.email) {
        toast.error("Username and email are required");
        return;
      }
      const newUser = await addUser({
        uuid: uuidv4(),
        clerkId: user.id,
        role: "user",
        username: values.username,
        email: values.email,
        orders: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast.success("Registered successfully");
      return newUser;
    });

    if (!userByClerkId) {
      toast.error("Something went wrong");
      await signOut();
      return;
    }

    const payload: UserType = {
      uuid: userByClerkId?.uuid,
      clerkId: user.id,
      role: userByClerkId.role,
      username: userByClerkId.username,
      email: userByClerkId.email,
      orders: userByClerkId.orders,
      createdAt: userByClerkId.createdAt,
      updatedAt: userByClerkId.updatedAt,
    };

    setUser(payload);
    await setActive({ session: sessionId });
    window.location.href = "/";
  };

  return {
    query,
    mutation: {
      changeRole: changeRoleMutation.mutate,
      addUser: addUserMutation.mutate,
    },
    setClerkUser,
  };
};

export default useUsers;
