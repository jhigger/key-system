import { fakeOrders } from "~/lib/fakeData";
import { type ProductKeyType } from "~/types/productKey";

export const keys: Partial<ProductKeyType>[] = fakeOrders.map(
  ({ product, key, expiry, hardwareId }) => {
    return {
      product,
      key,
      expiry,
      hardwareId,
    };
  },
);
