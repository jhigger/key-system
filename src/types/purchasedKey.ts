import { type VariantType } from "./variant";

export const statuses = ["active", "inactive"];

export type PurchasedKeyType = {
  uuid: string;
  key: string;
  variant: VariantType;
  expiry: string;
  status: (typeof statuses)[number];
  purchasedAt: string;
};
