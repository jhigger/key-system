import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getKeys, resetHardwareId } from "~/data-access/keys";

const useMyKeys = (userUUID?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["keys", userUUID],
    queryFn: () => getKeys(userUUID),
    enabled: !!userUUID,
  });

  const resetHardwareIdMutation = useMutation({
    mutationFn: async (hardwareId: string) => {
      return resetHardwareId(hardwareId);
    },
    onError: () => {
      toast.error("Failed to reset hardware ID");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["keys"] });
    },
    onSuccess: () => {
      toast.success("HWID reset successfully");
    },
  });

  return {
    query,
    mutation: {
      resetHardwareId: resetHardwareIdMutation.mutate,
    },
  };
};

export default useMyKeys;
