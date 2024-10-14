import { fakeProductKeys } from "~/lib/fakeData";
import { type ProductKeyType } from "~/types/productKey";
import { getProductKeys } from "./productKeys";

export const getKeys = (userUUID?: string): ProductKeyType[] => {
  return userUUID
    ? fakeProductKeys.filter(({ owner }) => owner === userUUID)
    : [];
};

export const addKey = (key: ProductKeyType) => {
  const productKeys = getProductKeys();

  productKeys.push(key);
  return productKeys;
};

export const resetHardwareId = (hardwareId: string): ProductKeyType => {
  const productKeys = getProductKeys();

  const index = productKeys.findIndex((key) => key.hardwareId === hardwareId);
  if (index !== -1) {
    const existingKey = productKeys[index];
    if (existingKey) {
      const updatedKey: ProductKeyType = {
        ...existingKey,
        hardwareId: null,
      };
      productKeys[index] = updatedKey;
      return updatedKey;
    }
  }
  throw new Error(`Key with hardwareId ${hardwareId} not found`);
};
