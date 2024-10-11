import { fakeOrders } from "~/lib/fakeData";
import { type PurchasedKeyType } from "~/types/purchasedKey";

export const orders: Partial<PurchasedKeyType>[] = fakeOrders.map(
  ({ createdAt, product, invoiceLink, variant }) => {
    return {
      createdAt,
      product,
      invoiceLink,
      variant,
    };
  },
);
