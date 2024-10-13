import { type PricingType } from "./pricing";
import { type ProductType } from "./product";

export type ProductKeyType = {
  uuid: string;
  product: ProductType;
  key: string;
  expiry?: string | null;
  hardwareId: string | null;
  owner: string | null;
  duration: PricingType["duration"];
  createdAt: string;
  updatedAt: string;
};

export type ProductKeyTypeWithStatus = ProductKeyType & {
  status: "active" | "expired";
};
