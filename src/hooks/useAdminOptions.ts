import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { editAdminOption, getAdminOptions } from "~/data-access/adminOptions";
import { type AdminOptionType } from "~/types/adminOption";
import useAuthToken from "./useAuthToken";

const useAdminOptions = () => {
  const getToken = useAuthToken();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-options"],
    queryFn: () => getAdminOptions(getToken),
  });

  const editAdminOptionMutation = useMutation({
    mutationFn: (adminOption: AdminOptionType) => {
      return editAdminOption(getToken, adminOption);
    },
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["admin-options"] });

      // Snapshot the previous value
      const previousAdminOptions = queryClient.getQueryData<AdminOptionType>(
        ["admin-options"]
      );

      // Return a context object with the snapshotted value
      return { previousAdminOptions };
    },
    onSuccess: (newAdminOptions) => {
      // Optimistically update to the new value
      queryClient.setQueryData<AdminOptionType>(
        ["admin-options"],
        (old) => {
          if (!old) return newAdminOptions;
          return newAdminOptions;
        }
      );
      toast.success("Admin options updated successfully");
    },
    onError: (err, newAdminOptions, context) => {
      // If the mutation fails, use the context to roll back
      queryClient.setQueryData(["admin-options"], context?.previousAdminOptions);
      toast.error(`Failed to update admin options: ${err.message}`);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-options"] });
    },
  });

  return {
    query, mutation: {
      editAdminOption: editAdminOptionMutation.mutate
    }
  };
};

export default useAdminOptions;