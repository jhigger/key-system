import { type PricingType } from "./pricing";

export type PurchasedKeyType = {
  uuid: string;
  product: string;
  key: string;
  invoiceLink: string;
  variant: PricingType["name"];
  expiry: string | null;
  hardwareId: string | null;
  owner: string | null;
  createdAt: string;
};
