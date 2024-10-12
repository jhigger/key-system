import { fakeOrders } from "~/lib/fakeData";
import { type ProductKeyType } from "~/types/productKey";

export const orders: Partial<ProductKeyType>[] = fakeOrders.map(
  ({ createdAt, productKey, invoiceLink }) => {
    return {
      createdAt,
      product: productKey.product,
      invoiceLink,
      variant: productKey.variant,
    };
  },
);
