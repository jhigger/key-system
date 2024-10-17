import { useClerk } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { changeUserRole, getUsers } from "~/data-access/users";
import { useUserStore } from "~/state/user.store";
import { type RoleType, type UserType } from "~/types/user";

const useUsers = () => {
  const { client, setActive } = useClerk();
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

  const setClerkUser = async (sessionId: string | null) => {
    const user = client.activeSessions[0]?.user;
    if (!user) {
      toast.error("User not found");
      return;
    }
    const userRole = (user.publicMetadata.role as RoleType) ?? "user";
    const payload: UserType = {
      uuid: user.id,
      clerkId: user.id,
      role: userRole,
      username: user.username ?? "dev",
      email: user.emailAddresses[0]?.emailAddress ?? "",
      orders: [],
      createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() ?? new Date().toISOString(),
    };

    setUser(payload);
    await setActive({ session: sessionId });
  };

  return {
    query,
    mutation: { changeRole: changeRoleMutation.mutate },
    setClerkUser,
  };
};

export default useUsers;
