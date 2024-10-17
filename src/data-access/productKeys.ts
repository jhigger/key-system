import { updateProductStock } from "~/data-access/products";
import { supabase } from "~/lib/initSupabase";
import { type ProductKeyType } from "~/types/productKey";

export const getProductKeys = async (): Promise<ProductKeyType[]> => {
  const { data, error } = await supabase
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

export const getAvailableProductKeys = async (): Promise<ProductKeyType[]> => {
  const productKeys = await getProductKeys();
  return productKeys.filter((key) => key.owner === null);
};

export const editProductKey = async (
  productKeyUuid: string,
  productKey: ProductKeyType,
): Promise<ProductKeyType> => {
  const oldProductKey = await getProductKeyById(productKeyUuid);
  const newPricingId = productKey.pricingId;

  if (
    newPricingId !== oldProductKey.pricingId &&
    productKey.productId === oldProductKey.productId
  ) {
    await updateProductStock(productKey.productId, oldProductKey.pricingId, -1);
    await updateProductStock(productKey.productId, newPricingId, 1);
  } else if (
    newPricingId !== oldProductKey.pricingId &&
    productKey.productId !== oldProductKey.productId
  ) {
    await updateProductStock(
      oldProductKey.productId,
      oldProductKey.pricingId,
      -1,
    );
    await updateProductStock(productKey.productId, newPricingId, 1);
  }

  const { data: productKeyData, error: productKeyError } = await supabase
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
    console.error("Error updating product key:", productKeyError);
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

export const addProductKey = async (
  productKey: ProductKeyType,
): Promise<ProductKeyType> => {
  const { data, error } = await supabase
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
    console.error("Error adding product key:", error);
    throw new Error("Failed to add product key");
  }

  await updateProductStock(productKey.productId, productKey.pricingId, 1);

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
  uuid: string,
): Promise<ProductKeyType[]> => {
  const productKeys = await getProductKeys();
  const deletedKeyIndex = productKeys.findIndex((key) => key.uuid === uuid);
  if (deletedKeyIndex === -1) {
    throw new Error(`Key ${uuid} not found`);
  }
  const deletedKey = productKeys[deletedKeyIndex];
  if (!deletedKey) {
    throw new Error(`Key ${uuid} not found`);
  }
  await updateProductStock(deletedKey.productId, deletedKey.pricingId, -1);
  productKeys.splice(deletedKeyIndex, 1);
  return productKeys;
};

const getProductKeyById = async (uuid: string): Promise<ProductKeyType> => {
  const productKeys = await getProductKeys();
  const productKey = productKeys.find((key) => key.uuid === uuid);
  if (!productKey) {
    throw new Error(`Key ${uuid} not found`);
  }
  return productKey;
};
