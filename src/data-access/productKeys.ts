import { supabase } from "~/lib/initSupabase";
import { type ProductKeyType } from "~/types/productKey";

export const getProductKeys = async (
  getToken: () => Promise<string | null>,
): Promise<ProductKeyType[]> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { data, error } = await supabase(token)
    .from("product_keys")
    .select("*") // Ensure that product_id, pricing_id, and hardware_id are included
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching product keys: ${error.message}`);
  }

  const productKeys = data.map((productKey) => ({
    uuid: productKey.uuid,
    productId: productKey.product_id,
    key: productKey.key,
    expiry: productKey.expiry,
    hardwareId: productKey.hardware_id,
    owner: productKey.owner,
    pricingId: productKey.pricing_id,
    createdAt: productKey.created_at,
    updatedAt: productKey.updated_at,
  }));

  return productKeys;
};

export const getAvailableProductKeys = async (
  getToken: () => Promise<string | null>,
): Promise<ProductKeyType[]> => {
  const productKeys = await getProductKeys(getToken);
  return productKeys.filter((key) => key.owner === null);
};

export const editProductKey = async (
  getToken: () => Promise<string | null>,
  productKeyUuid: string,
  productKey: ProductKeyType,
): Promise<ProductKeyType> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { data: productKeyData, error: productKeyError } = await supabase(token)
    .from("product_keys")
    .update({
      product_id: productKey.productId,
      key: productKey.key,
      hardware_id: productKey.hardwareId,
      owner: productKey.owner,
      pricing_id: productKey.pricingId,
      expiry: productKey.expiry,
      updated_at: new Date().toISOString(),
    })
    .eq("uuid", productKeyUuid)
    .select()
    .single();

  if (productKeyError) {
    throw new Error("Failed to update product key");
  }

  return {
    uuid: productKeyUuid,
    productId: productKeyData.product_id,
    key: productKeyData.key,
    expiry: productKeyData.expiry,
    hardwareId: productKeyData.hardware_id,
    owner: productKeyData.owner,
    pricingId: productKeyData.pricing_id,
    createdAt: productKeyData.created_at,
    updatedAt: productKeyData.updated_at,
  };
};

export const addProductKeys = async (
  getToken: () => Promise<string | null>,
  productKeys: ProductKeyType[],
): Promise<ProductKeyType[]> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  if (productKeys.length === 0 || !productKeys[0]) {
    throw new Error("No product key(s) provided");
  }

  const { data, error } = await supabase(token)
    .from("product_keys")
    .insert(
      productKeys.map((productKey) => ({
        product_id: productKey.productId,
        key: productKey.key,
        expiry: productKey.expiry,
        hardware_id: productKey.hardwareId,
        owner: productKey.owner,
        pricing_id: productKey.pricingId,
      })),
    )
    .select();

  if (error) {
    throw new Error("Failed to add product key(s)");
  }

  return data.map((productKey) => ({
    uuid: productKey.uuid,
    productId: productKey.product_id,
    key: productKey.key,
    expiry: productKey.expiry,
    hardwareId: productKey.hardware_id,
    owner: productKey.owner,
    pricingId: productKey.pricing_id,
    createdAt: productKey.created_at,
    updatedAt: productKey.updated_at,
  }));
};

export const deleteProductKey = async (
  getToken: () => Promise<string | null>,
  uuid: string,
): Promise<void> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { error } = await supabase(token)
    .from("product_keys")
    .delete()
    .eq("uuid", uuid);

  if (error) {
    throw new Error("Failed to delete product key");
  }
};
