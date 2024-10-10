import { v4 as uuidv4 } from "uuid";
import { products } from "~/types/product";
import { type PurchasedKeyType } from "~/types/purchasedKey";

export const keys: Partial<PurchasedKeyType>[] = [
  {
    product: products[0]?.name,
    key: uuidv4(),
    expiry: new Date(2024, 10 - 1, 9 + 30).toISOString(),
  },
  {
    product: products[0]?.name,
    key: uuidv4(),
    expiry: new Date(2024, 10 - 1, 8 + 3).toISOString(),
  },
  {
    product: products[1]?.name,
    key: uuidv4(),
    expiry: new Date(2024, 10 - 1, 7 + 1).toISOString(),
  },
  {
    product: products[1]?.name,
    key: uuidv4(),
    expiry: new Date(2024, 10 - 1, 6 + 1).toISOString(),
  },
  {
    product: products[0]?.name,
    key: uuidv4(),
    expiry: null,
  },
  {
    product: products[1]?.name,
    key: uuidv4(),
    expiry: new Date(2024, 10 - 1, 4 + 30).toISOString(),
  },
  {
    product: products[0]?.name,
    key: uuidv4(),
    expiry: new Date(2024, 10 - 1, 3 + 7).toISOString(),
  },
];
