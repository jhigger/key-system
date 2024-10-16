import { updateProductStock } from "~/data-access/products";
import { fakeProductKeys } from "~/lib/fakeData";
import { type ProductKeyType } from "~/types/productKey";

export const getProductKeys = (): ProductKeyType[] => fakeProductKeys;

export const getAvailableProductKeys = (): ProductKeyType[] =>
  fakeProductKeys.filter((key) => key.owner === null);

export const editProductKey = async (
  productKey: ProductKeyType,
): Promise<ProductKeyType> => {
  const productKeys = getProductKeys();
  const oldKey = findProductKeyById(productKeys, productKey.uuid);
  const { productChanged, pricingChanged } = checkChanges(oldKey, productKey);

  if (productChanged || pricingChanged) {
    await updateProductStocks(oldKey, productKey);
  }

  const updatedKey = { ...oldKey, ...productKey };
  return updateProductKeyInList(productKeys, updatedKey);
};

export const addProductKey = async (
  productKey: ProductKeyType,
): Promise<ProductKeyType> => {
  const productKeys = getProductKeys();
  productKeys.push(productKey);
  await updateProductStock(productKey.productId, productKey.pricingId, 1);
  return productKey;
};

export const deleteProductKey = async (
  uuid: string,
): Promise<ProductKeyType[]> => {
  const productKeys = getProductKeys();
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

// Helper functions
const findProductKeyById = (
  productKeys: ProductKeyType[],
  uuid: string,
): ProductKeyType => {
  const key = productKeys.find((key) => key.uuid === uuid);
  if (!key) throw new Error(`Key ${uuid} not found`);
  return key;
};

const checkChanges = (oldKey: ProductKeyType, newKey: ProductKeyType) => ({
  productChanged: oldKey.productId !== newKey.productId,
  pricingChanged: oldKey.pricingId !== newKey.pricingId,
});

const updateProductStocks = async (
  oldKey: ProductKeyType,
  newKey: ProductKeyType,
) => {
  await updateProductStock(oldKey.productId, oldKey.pricingId, -1);
  await updateProductStock(newKey.productId, newKey.pricingId, 1);
};

const updateProductKeyInList = (
  productKeys: ProductKeyType[],
  updatedKey: ProductKeyType,
): ProductKeyType => {
  const index = productKeys.findIndex((key) => key.uuid === updatedKey.uuid);
  if (index !== -1) {
    productKeys[index] = updatedKey;
  }
  return updatedKey;
};
