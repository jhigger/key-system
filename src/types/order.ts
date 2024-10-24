export type OrderType = {
  uuid: string;
  purchasedBy: string;
  invoiceLink: string;
  createdAt: string;
  updatedAt: string;
  status: "paid" | "unpaid" | "expired";
};
