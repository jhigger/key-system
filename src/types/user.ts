export const roles = ["admin", "user", "reseller"] as const;

export type RoleType = (typeof roles)[number];

export type UserType = {
  uuid: string;
  clerkId: string;
  role: RoleType;
  username: string;
  email: string;
  orders: string[] | null;
  createdAt: string;
  updatedAt: string;
};
