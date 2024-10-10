import { type PricingType } from "./pricing";

export const variants: [PricingType, ...PricingType[]] = [
  { name: "1 Day", value: "1.5" },
  { name: "3 Days", value: "3" },
  { name: "7 Days", value: "5" },
  { name: "30 Days", value: "13" },
  { name: "Lifetime", value: "150" },
];

export type VariantType = (typeof variants)[number];
