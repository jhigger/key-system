import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addProduct,
  deletePricing,
  deleteProduct,
  editPricing,
  editProduct,
  getProducts,
} from "~/data-access/products";
import { type PricingType } from "~/types/pricing";
import { type ProductType } from "~/types/product";
const useProducts = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const addProductMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: (newProduct) => {
      queryClient.setQueryData<ProductType[]>(["products"], (old) => {
        if (!old) return [newProduct];
        return [...old, newProduct];
      });
      toast.success("Product added successfully");
    },
    onError: (error) => {
      toast.error(`Failed to add product: ${error.message}`);
    },
  });

  const editMutation = useMutation({
    mutationFn: editProduct,
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
    onSettled: async () => {
      // Always refetch after error or success
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["productKeys"] });
    },
    onSuccess: () => {
      toast.success("Product updated successfully");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (deletedUuid: string) => {
      const result = deleteProduct(deletedUuid);
      return result;
    },
    onMutate: async (deletedUuid) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousProducts = queryClient.getQueryData<ProductType[]>([
        "products",
      ]);
      queryClient.setQueryData<ProductType[]>(["products"], (old) =>
        old ? old.filter((product) => product.uuid !== deletedUuid) : [],
      );
      return { previousProducts };
    },
    onError: (error) => {
      toast.error(`Failed to delete product: ${error.message}`);
    },
    onSettled: async () => {
      // Invalidate both products and product keys queries
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onSuccess: () => {
      toast.success("Product deleted successfully");
    },
  });

  const deletePricingMutation = useMutation({
    mutationFn: async ({
      productUuid,
      pricingUuid,
    }: {
      productUuid: string;
      pricingUuid: string;
    }) => {
      return deletePricing(productUuid, pricingUuid);
    },
    onMutate: async ({ productUuid, pricingUuid }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData<ProductType[]>([
        "products",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<ProductType[]>(["products"], (old) =>
        old
          ? old.map((product) =>
              product.uuid === productUuid
                ? {
                    ...product,
                    pricing: product.pricing.filter(
                      (p) => p.uuid !== pricingUuid,
                    ),
                  }
                : product,
            )
          : [],
      );

      // Return a context object with the snapshotted value
      return { previousProducts };
    },
    onError: (error) => {
      toast.error(`Failed to delete pricing: ${error.message}`);
    },
    onSettled: async () => {
      // Invalidate both products and product keys queries
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["productKeys"] });
    },
    onSuccess: () => {
      toast.success("Pricing deleted successfully");
    },
  });

  const editPricingMutation = useMutation({
    mutationFn: async ({
      productUuid,
      newPricing,
    }: {
      productUuid: string;
      newPricing: PricingType[];
    }) => {
      return editPricing(productUuid, newPricing);
    },
    onMutate: async ({ productUuid, newPricing }) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });

      const previousProducts = queryClient.getQueryData<ProductType[]>([
        "products",
      ]);

      queryClient.setQueryData<ProductType[]>(["products"], (old) =>
        old
          ? old.map((product) =>
              product.uuid === productUuid
                ? { ...product, pricing: newPricing }
                : product,
            )
          : [],
      );

      return { previousProducts };
    },
    onError: (error) => {
      toast.error(`Failed to edit pricing: ${error.message}`);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["productKeys"] });
    },
    onSuccess: () => {
      toast.success("Pricing updated successfully");
    },
  });

  return {
    query,
    mutation: {
      addProduct: addProductMutation.mutate,
      editProduct: editMutation.mutate,
      deleteProduct: deleteProductMutation.mutate,
      editPricing: editPricingMutation.mutate,
      deletePricing: deletePricingMutation.mutate,
    },
  };
};

export default useProducts;
