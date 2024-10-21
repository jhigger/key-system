import { supabase } from "~/lib/initSupabase";
import { type CategoryType } from "~/types/category";

export const getCategories = async (
  getToken: () => Promise<string | null>,
): Promise<CategoryType[]> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { data, error } = await supabase(token).from("categories").select("*");

  if (error) {
    throw new Error(error.message);
  }

  const categories = data.map((category) => ({
    uuid: category.uuid,
    name: category.name,
    createdAt: category.created_at,
    updatedAt: category.updated_at,
  }));

  return categories;
};

export const addCategory = async (
  getToken: () => Promise<string | null>,
  category: CategoryType,
): Promise<CategoryType> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { data, error } = await supabase(token)
    .from("categories")
    .insert({
      name: category.name,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const newCategory = {
    uuid: data.uuid,
    name: data.name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };

  return newCategory;
};

export const deleteCategory = async (
  getToken: () => Promise<string | null>,
  uuid: string,
): Promise<void> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { error: updateError } = await supabase(token)
    .from("products")
    .update({ category: null })
    .eq("category", uuid);

  if (updateError) {
    throw new Error(updateError.message);
  }

  const { error: deleteError } = await supabase(token)
    .from("categories")
    .delete()
    .eq("uuid", uuid);

  if (deleteError) {
    throw new Error(deleteError.message);
  }
};

export const editCategoryName = async (
  getToken: () => Promise<string | null>,
  category: Pick<CategoryType, "uuid" | "name">,
): Promise<CategoryType> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { data, error } = await supabase(token)
    .from("categories")
    .update({
      name: category.name,
    })
    .eq("uuid", category.uuid)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const updatedCategory = {
    uuid: data.uuid,
    name: data.name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };

  return updatedCategory;
};
