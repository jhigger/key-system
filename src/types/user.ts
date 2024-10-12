import { type ProductKeyType } from "./productKey";

export const roles = ["admin", "user", "reseller"] as const;

export type RoleType = (typeof roles)[number];

export type UserType = {
  uuid: string;
  role: RoleType;
  email: string;
  keys: ProductKeyType[] | null;
  createdAt: string;
  updatedAt: string;
};
