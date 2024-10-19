import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetHardwareId } from "~/data-access/keys";
import { getOrders } from "~/data-access/orders";
import { type OrderType } from "~/types/order";
import { type ProductKeyType } from "~/types/productKey";
import useAuthToken from "./useAuthToken";

const useMyKeys = (userUUID?: string) => {
  const getToken = useAuthToken();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["keys", userUUID],
    queryFn: () => getOrders(getToken, userUUID),
    enabled: !!userUUID,
  });

  const resetHardwareIdMutation = useMutation({
    mutationFn: (hardwareId: string) => resetHardwareId(getToken, hardwareId),
    onMutate: async (hardwareId) => {
      await queryClient.cancelQueries({ queryKey: ["keys", userUUID] });
      const previousKeys = queryClient.getQueryData<ProductKeyType[]>([
        "keys",
        userUUID,
      ]);
      queryClient.setQueryData<ProductKeyType[]>(["keys", userUUID], (old) => {
        if (!old) return [];
        return old.map((key) =>
          key.hardwareId === hardwareId ? { ...key, hardwareId: null } : key,
        );
      });
      return { previousKeys };
    },
    onError: (err, hardwareId, context: unknown) => {
      if (context && typeof context === "object" && "previousKeys" in context) {
        queryClient.setQueryData(
          ["keys", userUUID],
          (context as { previousKeys?: ProductKeyType[] }).previousKeys,
        );
      }
      toast.error(`Failed to reset HWID: ${err.message}`);
    },
    onSuccess: (updatedKey) => {
      queryClient.setQueryData<OrderType[]>(["orders", userUUID], (old) => {
        if (!old) return [updatedKey];
        return old.map((key) =>
          key.uuid === updatedKey.uuid ? updatedKey : key,
        );
      });
      toast.success("HWID reset successfully");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["keys", userUUID] });
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
