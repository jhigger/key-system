import { fakeOrders } from "~/lib/fakeData";
import { type PurchasedKeyType } from "~/types/purchasedKey";

export const orders: Partial<PurchasedKeyType>[] = fakeOrders.map(
  ({ purchasedAt, product, invoiceLink, variant }) => {
    return {
      purchasedAt,
      product,
      invoiceLink,
      variant,
    };
  },
);
