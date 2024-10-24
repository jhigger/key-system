import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetHardwareId } from "~/data-access/keys";
import {
  getProductKeySnapshotsByOrder,
  getProductKeySnapshotsByUser,
} from "~/data-access/productKeySnapshots";
import { type ProductKeySnapshotType } from "~/types/productKeySnapshot";
import useAuthToken from "./useAuthToken";

const useMyKeys = (userUUID: string, orderUUID?: string) => {
  const getToken = useAuthToken();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["my-keys", userUUID],
    queryFn: () => getProductKeySnapshotsByUser(getToken, userUUID),
    enabled: !!userUUID,
  });

  const productKeySnapshotsByOrderQuery = useQuery({
    queryKey: ["my-orders", orderUUID],
    queryFn: () => getProductKeySnapshotsByOrder(getToken, orderUUID),
    enabled: !!orderUUID,
  });

  const resetHardwareIdMutation = useMutation({
    mutationFn: (hardwareId: string) => resetHardwareId(getToken, hardwareId),
    onMutate: async (hardwareId) => {
      await queryClient.cancelQueries({ queryKey: ["my-keys", userUUID] });
      const previousKeys = queryClient.getQueryData<ProductKeySnapshotType[]>([
        "my-keys",
        userUUID,
      ]);
      queryClient.setQueryData<ProductKeySnapshotType[]>(
        ["my-keys", userUUID],
        (old) => {
          if (!old) return [];
          return old.map((key) =>
            key.hardwareId === hardwareId ? { ...key, hardwareId: null } : key,
          );
        },
      );
      return { previousKeys };
    },
    onError: (err, hardwareId, context: unknown) => {
      if (context && typeof context === "object" && "previousKeys" in context) {
        queryClient.setQueryData(
          ["my-keys", userUUID],
          (context as { previousKeys?: ProductKeySnapshotType[] }).previousKeys,
        );
      }
      toast.error(`Failed to reset HWID: ${err.message}`);
    },
    onSuccess: (updatedKey) => {
      queryClient.setQueryData<ProductKeySnapshotType[]>(
        ["my-keys", userUUID],
        (old) => {
          if (!old) return [updatedKey];
          return old.map((key) =>
            key.uuid === updatedKey.uuid ? updatedKey : key,
          );
        },
      );
      toast.success("HWID reset successfully");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["my-keys", userUUID] });
    },
  });

  return {
    query,
    mutation: {
      resetHardwareId: resetHardwareIdMutation.mutate,
    },
    productKeySnapshotsByOrderQuery,
  };
};

export default useMyKeys;
