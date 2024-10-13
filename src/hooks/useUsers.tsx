import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { changeUserRole, getUsers } from "~/data-access/users";
import { type UserType } from "~/types/user";

const useUsers = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const changeRoleMutation = useMutation({
    mutationFn: async (user: UserType) => {
      return changeUserRole(user);
    },
    onMutate: async (newUser) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData<UserType[]>(["users"]);

      // Optimistically update to the new value
      queryClient.setQueryData<UserType[]>(["users"], (old) =>
        old ? [...old, newUser] : [newUser],
      );

      // Return a context object with the snapshotted value
      return { previousUsers };
    },
    onError: (err, newUser, context) => {
      // If the mutation fails, use the context to roll back
      queryClient.setQueryData(["users"], context?.previousUsers);
      toast.error("Failed to change user role");
    },
    onSettled: async () => {
      // Always refetch after error or success
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onSuccess: () => {
      toast.success("User role updated successfully");
    },
  });

  return {
    query,
    mutation: { changeRole: changeRoleMutation.mutate },
  };
};

export default useUsers;
