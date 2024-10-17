import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addProductKey,
  deleteProductKey,
  editProductKey,
  getAvailableProductKeys,
} from "~/data-access/productKeys";
import { type ProductKeyType } from "~/types/productKey";

const useProductKeys = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["productKeys"],
    queryFn: () => getAvailableProductKeys(),
  });

  const addProductKeyMutation = useMutation({
    mutationFn: addProductKey,
    onMutate: async () => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["productKeys"] });

      // Snapshot the previous value
      const previousProductKeys = queryClient.getQueryData<ProductKeyType[]>([
        "productKeys",
      ]);

      // Return a context object with the snapshotted value
      return { previousProductKeys };
    },
    onError: (error, variables, context) => {
      if (context?.previousProductKeys) {
        queryClient.setQueryData(["productKeys"], context?.previousProductKeys);
      }
      toast.error(`Failed to add product key: ${error.message}`);
    },
    onSuccess: (newProductKey) => {
      // Optimistically update to the new value
      queryClient.setQueryData<ProductKeyType[]>(["productKeys"], (old) => {
        if (!old) return [newProductKey];
        return [...old, newProductKey];
      });
      toast.success("Product key added successfully");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["productKeys"] });
    },
  });

  const editProductKeyMutation = useMutation({
    mutationFn: (productKey: ProductKeyType) =>
      editProductKey(productKey.uuid, productKey),
    onMutate: async (productKey: ProductKeyType) => {
      const { uuid, ...updatedProductKey } = productKey;
      await queryClient.cancelQueries({ queryKey: ["productKeys"] });
      const previousProductKeys = queryClient.getQueryData<ProductKeyType[]>([
        "productKeys",
      ]);

      queryClient.setQueryData<ProductKeyType[]>(["productKeys"], (old) => {
        if (!old) return [{ ...updatedProductKey, uuid }];
        return old.map((key) =>
          key.uuid === uuid ? { ...key, ...updatedProductKey, uuid } : key,
        );
      });

      return { previousProductKeys };
    },
    onError: (error, variables, context) => {
      if (context?.previousProductKeys) {
        queryClient.setQueryData(["productKeys"], context.previousProductKeys);
      }
      toast.error(`Failed to edit product key: ${error.message}`);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["productKeys"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onSuccess: () => {
      toast.success("Product key updated successfully");
    },
  });

  const deleteProductKeyMutation = useMutation({
    mutationFn: deleteProductKey,
    onMutate: async (deletedUuid) => {
      await queryClient.cancelQueries({ queryKey: ["productKeys"] });
      const previousProductKeys = queryClient.getQueryData<ProductKeyType[]>([
        "productKeys",
      ]);
      queryClient.setQueryData<ProductKeyType[]>(["productKeys"], (old) =>
        old ? old.filter((key) => key.uuid !== deletedUuid) : [],
      );
      return { previousProductKeys };
    },
    onError: (error) => {
      toast.error(`Failed to delete product key: ${error.message}`);
    },
    onSettled: () => {
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
