import { type PricingType } from "./pricing";
import { type ProductKeyType } from "./productKey";

export type OrderType = {
  uuid: string;
  purchasedBy: string;
  productKeySnapshot: Omit<
    ProductKeyType,
    "pricingId" | "productId" | "hardwareId"
  > & {
    pricing: PricingType;
    productName: string;
  };
  invoiceLink: string;
  hardwareId: string | null;
  createdAt: string;
  updatedAt: string;
};
