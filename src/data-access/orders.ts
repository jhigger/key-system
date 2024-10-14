import { fakeOrders } from "~/lib/fakeData";
import { type OrderType } from "~/types/order";

export const getOrders = (userUUID?: string): OrderType[] => {
  return userUUID
    ? fakeOrders.filter(({ purchasedBy }) => purchasedBy === userUUID)
    : [];
};
