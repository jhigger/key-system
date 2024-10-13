import { fakeUsers } from "~/lib/fakeData";
import { type UserType } from "~/types/user";

export const getUsers = (): UserType[] => fakeUsers;

export const changeUserRole = (user: UserType): UserType => {
  const index = fakeUsers.findIndex((u) => u.uuid === user.uuid);
  if (index !== -1) {
    const existingUser = fakeUsers[index];
    if (existingUser) {
      const updatedUser: UserType = {
        ...existingUser,
        role: user.role,
      };
      fakeUsers[index] = updatedUser;
      return updatedUser;
    }
  }
  throw new Error(`User with email ${user.email} not found`);
};
