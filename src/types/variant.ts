import { type PricingType } from "./pricing";

export const variants: [PricingType, ...PricingType[]] = [
  { name: "1 Day - $1.50", value: "1.5" },
  { name: "3 Days - $3.00", value: "3" },
  { name: "7 Days - $5.00", value: "5" },
  { name: "30 Days - $13.00", value: "13" },
  { name: "Lifetime - $150.00", value: "150" },
];

export type VariantType = (typeof variants)[number];
