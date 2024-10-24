import { supabase } from "~/lib/initSupabase";
import { type OrderType } from "~/types/order";

export const getOrders = async (
  getToken: () => Promise<string | null>,
  userUUID?: string,
): Promise<OrderType[]> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  let query = supabase(token)
    .from("orders")
    .select("*")
    .eq("status", "paid")
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
      invoiceLink: order.invoice_link,
      createdAt: order.created_at,
      uuid: order.uuid,
      updatedAt: order.updated_at,
      status: order.status,
    }),
  );

  return orders;
};
