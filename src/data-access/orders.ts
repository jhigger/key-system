import { fakeOrders } from "~/lib/fakeData";
import { formatDuration } from "~/lib/utils";
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
          variant: formatDuration(productKey.duration),
        }))
    : [];
};
