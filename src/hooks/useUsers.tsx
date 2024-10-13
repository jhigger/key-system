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

  const mutation = useMutation({
    mutationFn: async (user: UserType) => {
      return changeUserRole(user);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] }).then(() => {
        toast.success("User role updated successfully");
      });
    },
    onError: () => {
      toast.error("Error changing user role");
    },
  });

  return { query, mutation };
};

export default useUsers;
