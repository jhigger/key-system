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

export const resetHardwareId = async (
  hardwareId: string,
): Promise<ProductKeyType> => {
  const productKeys = getProductKeys();

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
