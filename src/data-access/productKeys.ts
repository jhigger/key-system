import { updateProductStock } from "~/data-access/products";
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

  const oldProductKey = await getProductKeyById(getToken, productKeyUuid);
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

  // Always update stock for both old and new pricings
  if (oldProductKey.pricingId !== productKey.pricingId) {
    await updateProductStock(
      getToken,
      oldProductKey.productId,
      oldProductKey.pricingId,
      -1,
    );
    await updateProductStock(
      getToken,
      productKey.productId,
      productKey.pricingId,
      1,
    );
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

export const addProductKey = async (
  getToken: () => Promise<string | null>,
  productKey: ProductKeyType,
): Promise<ProductKeyType> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { data, error } = await supabase(token)
    .from("product_keys")
    .insert({
      product_id: productKey.productId,
      key: productKey.key,
      expiry: productKey.expiry,
      hardware_id: productKey.hardwareId,
      owner: productKey.owner,
      pricing_id: productKey.pricingId,
    })
    .select()
    .single();

  if (error) {
    throw new Error("Failed to add product key");
  }

  await updateProductStock(
    getToken,
    productKey.productId,
    productKey.pricingId,
    1,
  );

  return {
    uuid: data.uuid,
    productId: data.product_id,
    key: data.key,
    expiry: data.expiry,
    hardwareId: data.hardware_id,
    owner: data.owner,
    pricingId: data.pricing_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const deleteProductKey = async (
  getToken: () => Promise<string | null>,
  uuid: string,
): Promise<void> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const productKey = await getProductKeyById(getToken, uuid);

  const { error } = await supabase(token)
    .from("product_keys")
    .delete()
    .eq("uuid", uuid);

  if (error) {
    throw new Error("Failed to delete product key");
  }

  await updateProductStock(
    getToken,
    productKey.productId,
    productKey.pricingId,
    -1,
  );
};

const getProductKeyById = async (
  getToken: () => Promise<string | null>,
  uuid: string,
): Promise<ProductKeyType> => {
  const productKeys = await getProductKeys(getToken);
  const productKey = productKeys.find((key) => key.uuid === uuid);
  if (!productKey) {
    throw new Error(`Key ${uuid} not found`);
  }
  return productKey;
};
