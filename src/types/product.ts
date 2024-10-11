import { type PricingType } from "./pricing";

export type ProductType = {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  product: string;
  value: string;
  pricing: PricingType[];
  stock: number;
};
