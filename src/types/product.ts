import { type CategoryType } from "./category";
import { type PricingType } from "./pricing";

export type ProductType = {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  category: CategoryType["uuid"] | null;
  pricings: PricingType[];
};
