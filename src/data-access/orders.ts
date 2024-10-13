import { fakeOrders } from "~/lib/fakeData";
import { type OrderTypeWithVariant } from "~/types/order";

export const getOrders = (userUUID?: string): OrderTypeWithVariant[] => {
  return userUUID
    ? fakeOrders
        .filter(({ purchasedBy }) => purchasedBy === userUUID)
        .map(({ productKey, createdAt, invoiceLink, uuid, purchasedBy }) => ({
          uuid,
          purchasedBy,
          createdAt,
          product: productKey.product,
          invoiceLink,
          variant: productKey.variant,
        }))
    : [];
};
