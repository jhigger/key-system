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
      hardwareId: order.hardware_id,
      updatedAt: order.updated_at,
    }),
  );

  return orders;
};

export const addOrder = async (
  getToken: () => Promise<string | null>,
  order: OrderType,
) => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { error: orderError } = await supabase(token)
    .from("orders")
    .insert({
      purchased_by: order.purchasedBy,
      product_key_snapshot: order.productKeySnapshot,
      invoice_link: order.invoiceLink,
      created_at: order.createdAt,
      uuid: order.uuid,
      hardware_id: order.hardwareId,
      updated_at: order.updatedAt,
    })
    .select();

  if (orderError) {
    throw new Error(orderError.message);
  }

  const { error: productKeyError } = await supabase(token)
    .from("product_keys")
    .update({
      expiry: order.productKeySnapshot.expiry,
      owner: order.purchasedBy,
      updated_at: order.updatedAt,
    })
    .eq("uuid", order.productKeySnapshot.key)
    .select();

  if (productKeyError) {
    throw new Error(productKeyError.message);
  }

  const newOrder: OrderType = {
    ...order,
    productKeySnapshot: {
      ...order.productKeySnapshot,
      pricing: order.productKeySnapshot.pricing,
      productName: order.productKeySnapshot.productName,
    },
  };

  return newOrder;
};
