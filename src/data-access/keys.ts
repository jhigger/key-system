import { supabase } from "~/lib/initSupabase";
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
): Promise<ProductKeyType> => {
  const productKeys = await getProductKeys();

  const key = productKeys.find((key) => key.hardwareId === hardwareId);
  if (!key) {
    throw new Error(`Key with hardwareId ${hardwareId} not found`);
  }

  const updatedKey: ProductKeyType = {
    ...key,
    hardwareId: null,
  };

  const index = productKeys.findIndex((k) => k.uuid === key.uuid);
  if (index !== -1) {
    productKeys[index] = updatedKey;
  }

  return updatedKey;
};
