import { supabase } from "~/lib/initSupabase";
import { type OrderType } from "~/types/order";
import { type ProductKeyType } from "~/types/productKey";
import { getProductKeys } from "./productKeys";

export const getKeys = async (userUUID?: string): Promise<ProductKeyType[]> => {
  const { data, error } = await supabase.from("product_keys").select("*");

  if (error) {
    throw new Error(error.message);
  }

  const mappedData = (data || []).map((key) => ({
    uuid: key.uuid,
    key: key.key,
    productId: key.product_id,
    hardwareId: key.hardware_id,
    pricingId: key.pricing_id,
    owner: key.owner,
    expiry: key.expiry,
    createdAt: key.created_at,
    updatedAt: key.updated_at,
  }));

  return userUUID
    ? mappedData.filter(({ owner }) => owner === userUUID)
    : mappedData;
};

export const addKey = async (key: ProductKeyType) => {
  const productKeys = await getProductKeys();

  productKeys.push(key);
  return productKeys;
};

export const resetHardwareId = async (
  hardwareId: string,
): Promise<OrderType> => {
  const { data, error } = await supabase
    .from("orders")
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

  const productKeySnapshot = data.product_key_snapshot as OrderType;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { hardwareId: _, ...rest } = productKeySnapshot;

  return {
    uuid: data.uuid,
    productKeySnapshot: rest.productKeySnapshot,
    hardwareId: data.hardware_id,
    purchasedBy: data.purchased_by,
    invoiceLink: data.invoice_link,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const editMyKeysHardwareId = async (
  orderUuid: string,
  newHardwareId: string,
) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ hardware_id: newHardwareId })
    .eq("uuid", orderUuid)
    .select();

  if (error) {
    throw new Error(`Failed to edit product key hardware ID: ${error.message}`);
  }

  return data;
};
