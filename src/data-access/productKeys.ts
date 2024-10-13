import { fakeProductKeys } from "~/lib/fakeData";
import {
  type ProductKeyType,
  type ProductKeyTypeWithVariant,
} from "~/types/productKey";

export const getProductKeys = (): ProductKeyTypeWithVariant[] =>
  fakeProductKeys
    .filter((key) => key.owner === null)
    .map((key) => ({
      ...key,
      variant: key.duration,
    }));

export const editProductKey = (productKey: ProductKeyType): ProductKeyType => {
  const index = fakeProductKeys.findIndex(
    (key) => key.uuid === productKey.uuid,
  );
  if (index !== -1) {
    // Create a new object with the updated values
    const updatedKey = { ...fakeProductKeys[index], ...productKey };
    // Replace the old object with the new one
    fakeProductKeys[index] = updatedKey;
    return updatedKey;
  }
  throw new Error(`Key ${productKey.key} not found`);
};

export const addProductKey = (productKey: ProductKeyType) => {
  fakeProductKeys.push(productKey);
};

export const deleteProductKey = (uuid: string): ProductKeyType[] => {
  const index = fakeProductKeys.findIndex(
    (productKey) => productKey.uuid === uuid,
  );
  if (index !== -1) {
    fakeProductKeys.splice(index, 1);
  }
  return fakeProductKeys;
};
