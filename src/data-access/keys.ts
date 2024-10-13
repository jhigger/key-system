import { fakeProductKeys } from "~/lib/fakeData";
import {
  type ProductKeyType,
  type ProductKeyTypeWithStatus,
} from "~/types/productKey";

export const getKeys = (userUUID?: string): ProductKeyTypeWithStatus[] => {
  return userUUID
    ? fakeProductKeys
        .filter(({ owner }) => owner === userUUID)
        .map((key) => ({
          ...key,
          status: key.expiry
            ? new Date(key.expiry) < new Date()
              ? "expired"
              : "active"
            : "active",
        }))
    : [];
};

export const addKey = (key: ProductKeyType) => {
  fakeProductKeys.push(key);
};

export const resetHardwareId = (hardwareId: string): ProductKeyType => {
  const index = fakeProductKeys.findIndex(
    (key) => key.hardwareId === hardwareId,
  );
  if (index !== -1) {
    const existingKey = fakeProductKeys[index];
    if (existingKey) {
      const updatedKey: ProductKeyType = {
        ...existingKey,
        hardwareId: null,
      };
      fakeProductKeys[index] = updatedKey;
      return updatedKey;
    }
  }
  throw new Error(`Key with hardwareId ${hardwareId} not found`);
};
