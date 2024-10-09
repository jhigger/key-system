import { type PurchasedKeyType } from "./purchasedKey";

export type UserType = {
  id: string;
  email: string;
  keys: PurchasedKeyType[];
  createdAt: string;
  updatedAt: string;
};
