import { fakeOrders } from "~/lib/fakeData";
import { type ProductKeyType } from "~/types/productKey";

export const orders: Partial<ProductKeyType>[] = fakeOrders.map(
  ({ createdAt, product, invoiceLink, variant }) => {
    return {
      createdAt,
      product,
      invoiceLink,
      variant,
    };
  },
);
