import { type PurchasedKeyType } from "./purchasedKey";

type RoleType = "admin" | "user" | "reseller";

export type UserType = {
  uuid: string;
  role: RoleType;
  email: string;
  keys: PurchasedKeyType[] | null;
  createdAt: string;
  updatedAt: string;
};
