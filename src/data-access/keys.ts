import { supabase } from "~/lib/initSupabase";
import { type PricingType } from "~/types/pricing";
import { type ProductKeyType } from "~/types/productKey";
import { type ProductKeySnapshotType } from "~/types/productKeySnapshot";
import { getProductKeys } from "./productKeys";

export const getKeys = async (
  getToken: () => Promise<string | null>,
  userUUID?: string,
): Promise<ProductKeyType[]> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { data, error } = await supabase(token)
    .from("product_keys")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  const mappedData = (data || []).map((key) => ({
    uuid: key.uuid,
    key: key.key,
    productId: key.product_id,
    pricingId: key.pricing_id,
    owner: key.owner,
    createdAt: key.created_at,
    updatedAt: key.updated_at,
    reserved: key.reserved,
  }));

  return userUUID
    ? mappedData.filter(({ owner }) => owner === userUUID)
    : mappedData;
};

export const addKey = async (
  getToken: () => Promise<string | null>,
  key: ProductKeyType,
) => {
  const productKeys = await getProductKeys(getToken);

  productKeys.push(key);
  return productKeys;
};

export const resetHardwareId = async (
  getToken: () => Promise<string | null>,
  hardwareId: string,
): Promise<ProductKeySnapshotType> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { data, error } = await supabase(token)
    .from("product_keys_snapshots")
    .update({ hardware_id: null })
    .eq("hardware_id", hardwareId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to reset hardware ID: ${error.message}`);
  }

  if (!data) {
    throw new Error(`Key with hardwareId ${hardwareId} not found`);
  }

  const snapshot: ProductKeySnapshotType = {
    uuid: data.uuid,
    hardwareId: data.hardware_id,
    key: data.key,
    owner: data.owner,
    expiry: data.expiry,
    pricing: data.pricing as PricingType,
    productName: data.product_name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };

  return snapshot;
};

export const editMyKeysHardwareId = async (
  getToken: () => Promise<string | null>,
  orderUuid: string,
  newHardwareId: string,
) => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { data, error } = await supabase(token)
    .from("product_keys_snapshots")
    .update({ hardware_id: newHardwareId })
    .eq("uuid", orderUuid)
    .select();

  if (error) {
    throw new Error(`Failed to edit product key hardware ID: ${error.message}`);
  }

  return data;
};
