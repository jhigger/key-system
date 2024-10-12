import { type PricingType } from "./pricing";

export type ProductKeyType = {
  uuid: string;
  product: string;
  key: string;
  variant: PricingType["name"];
  expiry?: string | null;
  hardwareId: string | null;
  owner: string | null;
  createdAt: string;
  updatedAt: string;
};
