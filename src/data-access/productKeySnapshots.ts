import { supabase } from "~/lib/initSupabase";
import { type PricingType } from "~/types/pricing";
import { type ProductKeySnapshotType } from "~/types/productKeySnapshot";

export const getProductKeySnapshotsByOrder = async (
  getToken: () => Promise<string | null>,
  orderUUID?: string,
): Promise<ProductKeySnapshotType[]> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  if (!orderUUID) {
    throw new Error("No order UUID provided");
  }

  const { data, error } = await supabase(token)
    .from("product_keys_snapshots")
    .select("*, orders!inner(status)")
    .eq("order_id", orderUUID)
    .eq("orders.status", "paid")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching product keys: ${error.message}`);
  }

  const productKeys = data.map(
    (productKey): ProductKeySnapshotType => ({
      uuid: productKey.uuid,
      key: productKey.key,
      expiry: productKey.expiry,
      owner: productKey.owner,
      pricing: productKey.pricing as PricingType,
      productName: productKey.product_name,
      hardwareId: productKey.hardware_id,
      createdAt: productKey.created_at,
      updatedAt: productKey.updated_at,
    }),
  );

  return productKeys;
};

export const getProductKeySnapshotsByUser = async (
  getToken: () => Promise<string | null>,
  userUUID?: string,
): Promise<ProductKeySnapshotType[]> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  if (!userUUID) {
    throw new Error("No user UUID provided");
  }

  const { data, error } = await supabase(token)
    .from("product_keys_snapshots")
    .select("*, orders!inner(status)")
    .eq("owner", userUUID)
    .eq("orders.status", "paid")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching product keys: ${error.message}`);
  }

  const productKeys = data.map(
    (productKey): ProductKeySnapshotType => ({
      uuid: productKey.uuid,
      key: productKey.key,
      expiry: productKey.expiry,
      owner: productKey.owner,
      pricing: productKey.pricing as PricingType,
      productName: productKey.product_name,
      hardwareId: productKey.hardware_id,
      createdAt: productKey.created_at,
      updatedAt: productKey.updated_at,
    }),
  );

  return productKeys;
};
