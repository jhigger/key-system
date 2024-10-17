import { supabase } from "~/lib/initSupabase";
import { type OrderType } from "~/types/order";

export const getOrders = async (userUUID?: string): Promise<OrderType[]> => {
  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (userUUID) {
    query = query.eq("purchased_by", userUUID);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const orders = data.map(
    (order): OrderType => ({
      purchasedBy: order.purchased_by,
      productKeySnapshot:
        order.product_key_snapshot as OrderType["productKeySnapshot"],
      invoiceLink: order.invoice_link,
      createdAt: order.created_at,
      uuid: order.uuid,
    }),
  );

  return orders;
};
