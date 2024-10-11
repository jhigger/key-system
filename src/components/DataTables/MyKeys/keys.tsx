import { fakeOrders } from "~/lib/fakeData";
import { type PurchasedKeyType } from "~/types/purchasedKey";

export const keys: Partial<PurchasedKeyType>[] = fakeOrders.map(
  ({ product, key, expiry, hardwareId }) => {
    return {
      product,
      key,
      expiry,
      hardwareId,
    };
  },
);
