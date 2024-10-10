import { type PricingType } from "./pricing";

export type ProductType = {
  name: string;
  value: string;
  pricing: [PricingType, ...PricingType[]];
  stock: number;
};
