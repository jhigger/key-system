import { v4 as uuidv4 } from "uuid";
import { products } from "~/types/product";
import { type PurchasedKeyType } from "~/types/purchasedKey";
import { variants } from "~/types/variant";

export const orders: Partial<PurchasedKeyType>[] = [
  {
    purchasedAt: new Date(2024, 10 - 1, 9).toISOString(),
    product: products[0]?.name,
    invoiceLink: uuidv4(),
    variant: variants[3]?.name,
  },
  {
    purchasedAt: new Date(2024, 10 - 1, 8).toISOString(),
    product: products[0]?.name,
    invoiceLink: uuidv4(),
    variant: variants[1]?.name,
  },
  {
    purchasedAt: new Date(2024, 10 - 1, 7).toISOString(),
    product: products[1]?.name,
    invoiceLink: uuidv4(),
    variant: variants[0]?.name,
  },
  {
    purchasedAt: new Date(2024, 10 - 1, 6).toISOString(),
    product: products[1]?.name,
    invoiceLink: uuidv4(),
    variant: variants[0]?.name,
  },
  {
    purchasedAt: new Date(2024, 10 - 1, 5).toISOString(),
    product: products[0]?.name,
    invoiceLink: uuidv4(),
    variant: variants[4]?.name,
  },
  {
    purchasedAt: new Date(2024, 10 - 1, 4).toISOString(),
    product: products[1]?.name,
    invoiceLink: uuidv4(),
    variant: variants[3]?.name,
  },
  {
    purchasedAt: new Date(2024, 10 - 1, 3).toISOString(),
    product: products[0]?.name,
    invoiceLink: uuidv4(),
    variant: variants[2]?.name,
  },
];
