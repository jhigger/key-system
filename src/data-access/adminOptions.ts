import { supabase } from "~/lib/initSupabase";
import { type AdminOptionType } from "~/types/adminOption";

export const getAdminOptions = async (getToken: () => Promise<string | null>): Promise<AdminOptionType[]> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { data: adminOptions, error: adminOptionsError } = await supabase(token)
    .from("admin_options")
    .select("*")
    .order("created_at", { ascending: false });

  if (adminOptionsError) {
    throw new Error(adminOptionsError.message);
  }

  return adminOptions.map((adminOption) => ({
    uuid: adminOption.uuid,
    name: adminOption.name,
    value: adminOption.value,
    createdAt: adminOption.created_at,
    updatedAt: adminOption.updated_at,
  }));
}

export const editAdminOption = async (getToken: () => Promise<string | null>, adminOption: AdminOptionType): Promise<AdminOptionType> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { data, error } = await supabase(token)
    .from("admin_options")
    .update({ value: adminOption.value })
    .eq("uuid", adminOption.uuid)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    uuid: data.uuid,
    name: data.name,
    value: data.value,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}
