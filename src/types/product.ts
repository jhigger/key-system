import { type PricingType } from "./pricing";
import { variants } from "./variant";

export const products: [ProductType, ...ProductType[]] = [
  {
    name: "Distortion",
    value: "distortion",
    pricing: variants,
    stock: 999,
  },
  {
    name: "Densho",
    value: "densho",
    pricing: variants,
    stock: 99,
  },
  {
    name: "Unlock All",
    value: "unlock-all",
    pricing: variants,
    stock: 0,
  },
];

export type ProductType = {
  name: string;
  value: string;
  pricing: [PricingType, ...PricingType[]];
  stock: number;
};
