import { type PricingType } from "./pricing";

export type ProductType = {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  value: string;
  pricing: PricingType[];
  stock: number;
};
