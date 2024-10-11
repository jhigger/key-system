import { type PurchasedKeyType } from "./purchasedKey";

export const roles = ["admin", "user", "reseller"] as const;

type RoleType = (typeof roles)[number];

export type UserType = {
  uuid: string;
  role: RoleType;
  email: string;
  keys: PurchasedKeyType[] | null;
  createdAt: string;
  updatedAt: string;
};
