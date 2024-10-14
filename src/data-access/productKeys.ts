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

  const index = productKeys.findIndex((key) => key.uuid === productKey.uuid);
  if (index === -1) {
    throw new Error(`Key ${productKey.key} not found`);
  }

  const oldKey = productKeys[index];
  if (!oldKey) {
    throw new Error(`Key ${productKey.key} is undefined`);
  }

  const getDuration = (duration: number | null | undefined): number => {
    if (duration === null || duration === undefined || isNaN(duration)) {
      return 0; // Lifetime
    }
    return duration;
  };

  const oldDuration = getDuration(oldKey.duration);
  const newDuration = getDuration(productKey.duration);

  // Increase stock for the old product key
  await updateProductStock(oldKey.product.uuid, oldDuration, -1);

  // Decrease stock for the new product key
  await updateProductStock(productKey.product.uuid, newDuration, 1);

  // Create a new object with the updated values
  const updatedKey = { ...oldKey, ...productKey, duration: newDuration };
  // Replace the old object with the new one
  productKeys[index] = updatedKey;
  return updatedKey;
};

export const addProductKey = async (
  productKey: ProductKeyType,
): Promise<ProductKeyType> => {
  const productKeys = getProductKeys();

  productKeys.push(productKey);
  // Update stock when adding a new product key
  await updateProductStock(productKey.product.uuid, productKey.duration, 1);
  return productKey;
};

export const deleteProductKey = async (
  uuid: string,
): Promise<ProductKeyType[]> => {
  const productKeys = getProductKeys();

  const index = productKeys.findIndex((productKey) => productKey.uuid === uuid);
  if (index === -1) {
    throw new Error(`Key with UUID ${uuid} not found`);
  }

  const deletedKey = productKeys[index];
  if (!deletedKey) {
    throw new Error(`Key with UUID ${uuid} is undefined`);
  }

  // Update stock when deleting a product key
  await updateProductStock(deletedKey.product.uuid, deletedKey.duration, -1);

  productKeys.splice(index, 1);

  return productKeys;
};
