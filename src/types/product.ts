import { type PricingType } from "./pricing";

export type ProductType = {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  pricings: PricingType[];
};
