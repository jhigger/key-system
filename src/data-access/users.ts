import { supabase } from "~/lib/initSupabase";
import { type RoleType, type UserType } from "~/types/user";

export const getUsers = async (): Promise<UserType[]> => {
  const { data, error } = await supabase.from("users").select("*");

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

export const changeUserRole = async (user: UserType): Promise<UserType> => {
  const users = await getUsers();

  const index = users.findIndex((u) => u.uuid === user.uuid);
  if (index !== -1) {
    const existingUser = users[index];
    if (existingUser) {
      const updatedUser: UserType = {
        ...existingUser,
        role: user.role,
      };
      users[index] = updatedUser;
      return updatedUser;
    }
  }
  throw new Error(`User with email ${user.email} not found`);
};
