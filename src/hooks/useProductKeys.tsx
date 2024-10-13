import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addProductKey,
  deleteProductKey,
  editProductKey,
  getProductKeys,
} from "~/data-access/productKeys";
import { type ProductKeyType } from "~/types/productKey";

const useProductKeys = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["productKeys"],
    queryFn: () => getProductKeys(),
  });

  const addProductKeyMutation = useMutation({
    mutationFn: async (productKey: ProductKeyType) => {
      return addProductKey(productKey);
    },
    onMutate: async (newProductKey) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["productKeys"] });

      // Snapshot the previous value
      const previousProductKeys = queryClient.getQueryData<ProductKeyType[]>([
        "productKeys",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<ProductKeyType[]>(["productKeys"], (old) =>
        old ? [...old, newProductKey] : [newProductKey],
      );

      // Return a context object with the snapshotted value
      return { previousProductKeys };
    },
    onError: (err, newProductKey, context) => {
      // If the mutation fails, use the context to roll back
      queryClient.setQueryData(["productKeys"], context?.previousProductKeys);
      toast.error("Failed to add product key");
    },
    onSettled: async () => {
      // Always refetch after error or success
      await queryClient.invalidateQueries({ queryKey: ["productKeys"] });
    },
    onSuccess: () => {
      toast.success("Product key added successfully");
    },
  });

  const editProductKeyMutation = useMutation({
    mutationFn: async (productKey: ProductKeyType) => {
      return editProductKey(productKey);
    },
    onMutate: async (updatedProductKey) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["productKeys"] });

      // Snapshot the previous value
      const previousProductKeys = queryClient.getQueryData<ProductKeyType[]>([
        "productKeys",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<ProductKeyType[]>(["productKeys"], (old) => {
        if (!old) return [updatedProductKey];
        return old.map((key) =>
          key.uuid === updatedProductKey.uuid
            ? { ...key, ...updatedProductKey }
            : key,
        );
      });

      // Return a context object with the snapshotted value
      return { previousProductKeys };
    },
    onError: (err, newProductKey, context) => {
      // If the mutation fails, use the context to roll back
      queryClient.setQueryData(["productKeys"], context?.previousProductKeys);
      toast.error("Failed to update product key");
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      void queryClient.invalidateQueries({ queryKey: ["productKeys"] });
    },
    onSuccess: () => {
      toast.success("Product key updated successfully");
    },
  });

  const deleteProductKeyMutation = useMutation({
    mutationFn: async (uuid: string) => {
      return deleteProductKey(uuid);
    },
    onMutate: async (deletedUuid) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["productKeys"] });

      // Snapshot the previous value
      const previousProductKeys = queryClient.getQueryData<ProductKeyType[]>([
        "productKeys",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<ProductKeyType[]>(["productKeys"], (old) =>
        old ? old.filter((key) => key.uuid !== deletedUuid) : [],
      );

      // Return a context object with the snapshotted value
      return { previousProductKeys };
    },
    onError: (err, newTodo, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["productKeys"], context?.previousProductKeys);
      toast.error("Failed to delete product key");
    },
    onSettled: () => {
      // Always refetch after error or success:
      void queryClient.invalidateQueries({ queryKey: ["productKeys"] });
    },
    onSuccess: () => {
      toast.success("Product key deleted successfully");
    },
  });

  return {
    query,
    mutation: {
      addProductKey: addProductKeyMutation.mutate,
      editProductKey: (productKey: ProductKeyType) => {
        const currentKeys = queryClient.getQueryData<ProductKeyType[]>([
          "productKeys",
        ]);
        const existingKey = currentKeys?.find(
          (key) => key.uuid === productKey.uuid,
        );

        if (JSON.stringify(existingKey) !== JSON.stringify(productKey)) {
          editProductKeyMutation.mutate(productKey);
        }
      },
      deleteProductKey: deleteProductKeyMutation.mutate,
    },
  };
};

export default useProductKeys;
