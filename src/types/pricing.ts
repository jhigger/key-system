export const variants = [
  "1 Day",
  "3 Days",
  "7 Days",
  "30 Days",
  "Lifetime",
] as const;

export type PricingType = {
  name: (typeof variants)[number];
  value: string;
};
