import { fakeOrders } from "~/lib/fakeData";
import { type ProductKeyType } from "~/types/productKey";

export const keys: Partial<ProductKeyType>[] = fakeOrders.map(
  ({ productKey }) => {
    return productKey;
  },
);
