import { type ProductKeyType } from "./productKey";

export type OrderType = {
  uuid: string;
  purchasedBy: string;
  productKey: ProductKeyType;
  invoiceLink: string;
  createdAt: string;
};

export type OrderTypeForTable = Omit<OrderType, "productKey"> & {
  variant: ProductKeyType["variant"];
};
