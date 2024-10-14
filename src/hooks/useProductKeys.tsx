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
    onMutate: async (newProductKey) => {
      await queryClient.cancelQueries({ queryKey: ["productKeys"] });
      const previousProductKeys = queryClient.getQueryData<ProductKeyType[]>([
        "productKeys",
      ]);
      queryClient.setQueryData<ProductKeyType[]>(["productKeys"], (old) =>
        old ? [...old, newProductKey] : [newProductKey],
      );
      return { previousProductKeys };
    },
    onError: (err, newProductKey, context: unknown) => {
      if (
        context &&
        typeof context === "object" &&
        "previousProductKeys" in context
      ) {
        queryClient.setQueryData(
          ["productKeys"],
          (context as { previousProductKeys?: ProductKeyType[] })
            .previousProductKeys,
        );
      }
      toast.error("Failed to add product key");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["productKeys"] });
    },
    onSuccess: () => {
      toast.success("Product key added successfully");
    },
  });

  const editProductKeyMutation = useMutation({
    mutationFn: editProductKey,
    onMutate: async (updatedProductKey) => {
      await queryClient.cancelQueries({ queryKey: ["productKeys"] });
      const previousProductKeys = queryClient.getQueryData<ProductKeyType[]>([
        "productKeys",
      ]);
      queryClient.setQueryData<ProductKeyType[]>(["productKeys"], (old) => {
        if (!old) return [updatedProductKey];
        return old.map((key) =>
          key.uuid === updatedProductKey.uuid
            ? { ...key, ...updatedProductKey }
            : key,
        );
      });
      return { previousProductKeys };
    },
    onError: (err, newProductKey, context: unknown) => {
      if (
        context &&
        typeof context === "object" &&
        "previousProductKeys" in context
      ) {
        queryClient.setQueryData(
          ["productKeys"],
          (context as { previousProductKeys?: ProductKeyType[] })
            .previousProductKeys,
        );
      }
      toast.error("Failed to update product key");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["productKeys"] });
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
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["productKeys"], context?.previousProductKeys);
      toast.error("Failed to delete product key");
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
