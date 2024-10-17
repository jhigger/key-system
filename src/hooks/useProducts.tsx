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
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const editMutation = useMutation({
    mutationFn: async (product: ProductType) => {
      return editProduct(product.uuid, product);
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
    onSettled: async () => {
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
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["productKeys"] });
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
          ? old.reduce((acc, product) => {
              if (product.uuid === productUuid) {
                const updatedPricings = product.pricings.filter(
                  (p) => p.uuid !== pricingUuid,
                );
                // If there are no pricings left, don't include the product
                if (updatedPricings.length === 0) {
                  return acc;
                }
                return [...acc, { ...product, pricings: updatedPricings }];
              }
              return [...acc, product];
            }, [] as ProductType[])
          : [],
      );

      // Return a context object with the snapshotted value
      return { previousProducts };
    },
    onError: (error, variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
      toast.error(`Failed to delete pricing: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Pricing deleted successfully");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["productKeys"] });
    },
  });

  const editPricingMutation = useMutation({
    mutationFn: async ({
      pricingUuid,
      newPricing,
    }: {
      pricingUuid: string;
      newPricing: PricingType;
    }) => {
      return editPricing(pricingUuid, newPricing);
    },
    onMutate: async ({ pricingUuid, newPricing }) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });

      const previousProducts = queryClient.getQueryData<ProductType[]>([
        "products",
      ]);

      queryClient.setQueryData<ProductType[]>(
        ["products"],
        (old) =>
          old?.map((product) => ({
            ...product,
            pricings: product.pricings.map((p) => {
              if (p.uuid === pricingUuid) {
                return {
                  ...p,
                  duration: newPricing.duration,
                  value: Number(newPricing.value.toFixed(2)),
                  stock: newPricing.stock,
                };
              }
              return p;
            }),
          })) ?? [],
      );

      return { previousProducts };
    },
    onError: (error, variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
      toast.error(`Failed to edit pricing: ${error.message}`);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
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
