import { supabase } from "~/lib/initSupabase";
import { type RoleType, type UserType } from "~/types/user";

export const getUsers = async (
  getToken: () => Promise<string | null>,
): Promise<UserType[]> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { data, error } = await supabase(token)
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
      approvedBy: user.approved_by,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }),
  );
};

export const getUserByClerkId = async (
  getToken: () => Promise<string | null>,
  clerkId: string,
): Promise<UserType | null> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  if (!clerkId) {
    return null;
  }

  const { data, error } = await supabase(token)
    .from("users")
    .select("*")
    .eq("clerk_id", clerkId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to get user by clerk ID: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const user = {
    uuid: data.uuid,
    clerkId: data.clerk_id,
    role: data.role as RoleType,
    username: data.username,
    email: data.email,
    approvedBy: data.approved_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };

  return user;
};

export const addUser = async (
  getToken: () => Promise<string | null>,
  user: UserType,
): Promise<UserType> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { data, error } = await supabase(token)
    .from("users")
    .insert({
      clerk_id: user.clerkId,
      role: user.role,
      username: user.username,
      email: user.email,
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
    approvedBy: data.approved_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };

  return newUser;
};

export const changeUserRole = async (
  getToken: () => Promise<string | null>,
  user: Pick<UserType, "uuid" | "role">,
): Promise<UserType> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { data, error } = await supabase(token)
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
    approvedBy: data.approved_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const approveUser = async (
  getToken: () => Promise<string | null>,
  uuid: string,
  approvedBy: string | null,
) => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { error } = await supabase(token)
    .from("users")
    .update({ approved_by: approvedBy })
    .eq("uuid", uuid);

  if (error) {
    throw new Error(`Failed to approve user: ${error.message}`);
  }
};
