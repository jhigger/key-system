import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addProduct,
  deleteProduct,
  editProduct,
  getProducts,
} from "~/data-access/products";
import { type ProductType } from "~/types/product";

const useProducts = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const addProductMutation = useMutation({
    mutationFn: async (product: ProductType) => {
      return addProduct(product);
    },
    onMutate: async (newProduct) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData<ProductType[]>([
        "products",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<ProductType[]>(["products"], (old) =>
        old ? [...old, newProduct] : [newProduct],
      );

      // Return a context object with the snapshotted value
      return { previousProducts };
    },
    onError: (err, newProduct, context) => {
      // If the mutation fails, use the context to roll back
      queryClient.setQueryData(["products"], context?.previousProducts);
      toast.error("Failed to add product");
    },
    onSettled: () => {
      // Always refetch after error or success
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onSuccess: () => {
      toast.success("Product added successfully");
    },
  });

  const editMutation = useMutation({
    mutationFn: async (product: ProductType) => {
      return editProduct(product);
    },
    onMutate: async (product) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData<ProductType[]>([
        "products",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<ProductType[]>(["products"], (old) => {
        if (!old) return [product];
        return old.map((p) => (p.uuid === product.uuid ? product : p));
      });

      // Return a context object with the snapshotted value
      return { previousProducts };
    },
    onError: (err, product, context) => {
      // If the mutation fails, use the context to roll back
      queryClient.setQueryData(["products"], context?.previousProducts);
      toast.error("Error editing product");
    },
    onSettled: () => {
      // Always refetch after error or success
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onSuccess: () => {
      toast.success("Product updated successfully");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (uuid: string) => {
      return deleteProduct(uuid);
    },
    onMutate: async (deletedUuid) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData<ProductType[]>([
        "products",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<ProductType[]>(["products"], (old) =>
        old ? old.filter((product) => product.uuid !== deletedUuid) : [],
      );

      // Return a context object with the snapshotted value
      return { previousProducts };
    },
    onError: (err, newTodo, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["products"], context?.previousProducts);
      toast.error("Failed to delete product");
    },
    onSettled: () => {
      // Always refetch after error or success:
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onSuccess: () => {
      toast.success("Product deleted successfully");
    },
  });

  return {
    query,
    mutation: {
      addProduct: addProductMutation.mutate,
      editProduct: (product: ProductType) => {
        const currentProducts = queryClient.getQueryData<ProductType[]>([
          "products",
        ]);
        const existingProduct = currentProducts?.find(
          (p) => p.uuid === product.uuid,
        );

        if (JSON.stringify(existingProduct) !== JSON.stringify(product)) {
          editMutation.mutate(product);
        }
      },
      deleteProduct: deleteProductMutation.mutate,
    },
  };
};

export default useProducts;
