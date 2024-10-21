import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addCategory,
  deleteCategory,
  editCategoryName,
  getCategories,
} from "~/data-access/categories";
import { type CategoryType } from "~/types/category";
import useAuthToken from "./useAuthToken";

const useCategories = () => {
  const getToken = useAuthToken();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(getToken),
  });

  const addCategoryMutation = useMutation({
    mutationFn: (category: CategoryType) => addCategory(getToken, category),
    onMutate: async () => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      // Snapshot the previous value
      const previousCategories = queryClient.getQueryData<CategoryType[]>([
        "categories",
      ]);

      return { previousCategories };
    },
    onSuccess: (newCategory) => {
      // Optimistically update to the new value
      queryClient.setQueryData<CategoryType[]>(["categories"], (old) => {
        if (!old) return [newCategory];
        return [...old, newCategory];
      });
      toast.success("Category added successfully");
    },
    onError: (error, variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context?.previousCategories);
      }
      toast.error(`Failed to add category: ${error.message}`);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const editCategoryNameMutation = useMutation({
    mutationFn: (category: Pick<CategoryType, "uuid" | "name">) =>
      editCategoryName(getToken, category),
    onMutate: async () => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      // Snapshot the previous value
      const previousCategories = queryClient.getQueryData<CategoryType[]>([
        "categories",
      ]);

      return { previousCategories };
    },
    onSuccess: (updatedCategory) => {
      // Optimistically update to the new value
      queryClient.setQueryData<CategoryType[]>(["categories"], (old) => {
        if (!old) return [updatedCategory];
        return old.map((category) =>
          category.uuid === updatedCategory.uuid ? updatedCategory : category,
        );
      });
      toast.success("Category name updated successfully");
    },
    onError: (error, variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context?.previousCategories);
      }
      toast.error(`Failed to update category name: ${error.message}`);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (uuid: string) => deleteCategory(getToken, uuid),
    onMutate: async () => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      // Snapshot the previous value
      const previousCategories = queryClient.getQueryData<CategoryType[]>([
        "categories",
      ]);

      return { previousCategories };
    },
    onSuccess: () => {
      toast.success("Category deleted successfully", {
        description: "All products using this category are set to None",
      });
    },
    onError: (error, variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context?.previousCategories);
      }
      toast.error(`Failed to delete category: ${error.message}`);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    query,
    mutation: {
      addCategory: addCategoryMutation.mutate,
      editCategoryName: editCategoryNameMutation.mutate,
      deleteCategory: deleteCategoryMutation.mutate,
    },
  };
};

export default useCategories;
