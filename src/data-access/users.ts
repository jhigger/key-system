import { supabase } from "~/lib/initSupabase";
import { type RoleType, type UserType } from "~/types/user";

export const getUsers = async (): Promise<UserType[]> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(
    (user): UserType => ({
      uuid: user.uuid,
      clerkId: user.clerk_id,
      role: user.role as RoleType,
      username: user.username,
      email: user.email,
      orders: user.orders ?? [], // Ensure orders is an array
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }),
  );
};

export const getUserByClerkId = async (
  clerkId: string,
): Promise<UserType | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkId)
    .single();

  if (error) {
    throw new Error(`Failed to get user by clerk ID: ${error.message}`);
  }

  const user = {
    uuid: data.uuid,
    clerkId: data.clerk_id,
    role: data.role as RoleType,
    username: data.username,
    email: data.email,
    orders: data.orders ?? [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };

  return user;
};

export const addUser = async (user: UserType): Promise<UserType> => {
  const { data, error } = await supabase
    .from("users")
    .insert({
      clerk_id: user.clerkId,
      role: user.role,
      username: user.username,
      email: user.email,
      orders: user.orders,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add user: ${error.message}`);
  }

  const newUser = {
    uuid: data.uuid,
    clerkId: data.clerk_id,
    role: data.role as RoleType,
    username: data.username,
    email: data.email,
    orders: data.orders ?? [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };

  return newUser;
};

export const changeUserRole = async (user: UserType): Promise<UserType> => {
  const { data, error } = await supabase
    .from("users")
    .update({ role: user.role })
    .eq("uuid", user.uuid)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update user role: ${error.message}`);
  }

  if (!data) {
    throw new Error(`User with UUID ${user.uuid} not found`);
  }

  return {
    uuid: data.uuid,
    clerkId: data.clerk_id,
    role: data.role as RoleType,
    username: data.username,
    email: data.email,
    orders: data.orders ?? [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};
