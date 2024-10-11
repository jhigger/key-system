import { fakeOrders } from "~/lib/fakeData";
import { type PurchasedKeyType } from "~/types/purchasedKey";

export const keys: Partial<PurchasedKeyType>[] = fakeOrders.map(
  ({ product, key, expiry }) => {
    return {
      product,
      key,
      expiry,
    };
  },
);
