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

  const mutation = useMutation({
    mutationFn: async (hardwareId: string) => {
      return resetHardwareId(hardwareId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["keys"] }).then(() => {
        toast.success("HWID reset successfully");
      });
    },
    onError: () => {
      toast.error("Error resetting HWID");
    },
  });

  return { query, mutation };
};

export default useMyKeys;
