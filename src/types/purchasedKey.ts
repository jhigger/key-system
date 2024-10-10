import { type VariantType } from "./variant";

export type PurchasedKeyType = {
  uuid: string;
  product: string;
  key: string;
  invoiceLink: string;
  variant: VariantType["name"];
  expiry: string | null;
  purchasedAt: string;
};
