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
    onSuccess: () => {
      toast.success("Category added successfully");
    },
    onError: () => {
      toast.error("Failed to add category");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const editCategoryNameMutation = useMutation({
    mutationFn: (category: Pick<CategoryType, "uuid" | "name">) =>
      editCategoryName(getToken, category),
    onSuccess: () => {
      toast.success("Category name updated successfully");
    },
    onError: () => {
      toast.error("Failed to update category name");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (uuid: string) => deleteCategory(getToken, uuid),
    onSuccess: () => {
      toast.success("Category deleted successfully", {
        description:
          "All products using this category are set to None",
      });
    },
    onError: () => {
      toast.error("Failed to delete category");
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
