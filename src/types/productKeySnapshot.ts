import { type PricingType } from "./pricing";
import { type ProductKeyType } from "./productKey";

export type ProductKeySnapshotType = Omit<
  ProductKeyType,
  "pricingId" | "productId" | "owner" | "reserved"
> & {
  owner: string;
  pricing: PricingType;
  productName: string;
  hardwareId: string | null;
};
