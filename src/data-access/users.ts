import { fakeUsers } from "~/lib/fakeData";
import { type UserType } from "~/types/user";

export const getUsers = (): UserType[] => fakeUsers;

export const changeUserRole = (user: UserType): UserType => {
  const users = getUsers();

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
