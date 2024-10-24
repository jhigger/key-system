import { type PricingType } from "./pricing";
import { type ProductType } from "./product";

export type ProductKeyType = {
  uuid: string;
  productId: ProductType["uuid"];
  key: string;
  expiry?: string | null;
  owner: string | null;
  pricingId: PricingType["uuid"];
  createdAt: string;
  updatedAt: string;
  reserved: boolean;
};
