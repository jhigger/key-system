import { fakeProducts } from "~/lib/fakeData";
import { type ProductType } from "~/types/product";
import { getAvailableProductKeys } from "./productKeys";

export const getProducts = (): ProductType[] => fakeProducts;

export const editProduct = (product: ProductType) => {
  const products = getProducts();

  const index = products.findIndex((p) => p.uuid === product.uuid);
  if (index !== -1) {
    // Create a new object with the updated values
    const updatedProduct = { ...products[index], ...product };
    // Replace the old object with the new one
    products[index] = updatedProduct;
    return updatedProduct;
  }
  throw new Error(`Product ${product.name} not found`);
};

export const addProduct = (product: ProductType) => {
  const products = getProducts();

  products.push(product);
  return products;
};

export const deleteProduct = (uuid: string): ProductType[] => {
  const products = getProducts();
  const productKeys = getAvailableProductKeys();

  const index = products.findIndex((product) => product.uuid === uuid);
  if (index !== -1) {
    // Remove the product
    products.splice(index, 1);

    // Remove all associated product keys
    const updatedProductKeys = productKeys.filter(
      (key) => key.product.uuid !== uuid,
    );
    productKeys.length = 0;
    productKeys.push(...updatedProductKeys);
  }
  return products;
};

export const deletePricing = (
  productUuid: string,
  pricingUuid: string,
): ProductType | null => {
  const products = getProducts();
  const productKeys = getAvailableProductKeys();

  const productIndex = products.findIndex(
    (product) => product.uuid === productUuid,
  );
  if (productIndex === -1) {
    throw new Error(`Product ${productUuid} not found`);
  }

  const product = products[productIndex];
  if (!product) {
    throw new Error(`Product ${productUuid} not found`);
  }

  const pricingToDelete = product.pricing.find((p) => p.uuid === pricingUuid);
  if (!pricingToDelete) {
    throw new Error(`Pricing ${pricingUuid} not found`);
  }

  const updatedPricing = product.pricing.filter(
    (pricing) => pricing.uuid !== pricingUuid,
  );

  // Delete associated product keys
  const keysToDeleteIndices = productKeys.reduce((acc, key, index) => {
    if (
      key.product.uuid === productUuid &&
      key.duration === pricingToDelete.duration
    ) {
      acc.push(index);
    }
    return acc;
  }, [] as number[]);

  // Remove keys from highest index to lowest to avoid shifting issues
  for (let i = keysToDeleteIndices.length - 1; i >= 0; i--) {
    productKeys.splice(keysToDeleteIndices[i]!, 1);
  }

  if (updatedPricing.length === 0) {
    // If no pricing options left, delete the entire product
    products.splice(productIndex, 1);
    return null;
  } else {
    const updatedProduct = { ...product, pricing: updatedPricing };
    products[productIndex] = updatedProduct;
    return updatedProduct;
  }
};

export const updateProductStock = async (
  productUuid: string,
  duration: number,
  change: number,
): Promise<ProductType> => {
  const products = getProducts();

  const productIndex = products.findIndex((p) => p.uuid === productUuid);
  if (productIndex === -1) {
    throw new Error(`Product not found: ${productUuid}`);
  }

  const product = products[productIndex];
  if (!product) {
    throw new Error(`Product not found: ${productUuid}`);
  }
  const pricingIndex = product.pricing.findIndex(
    (p) => p.duration === duration,
  );

  if (pricingIndex === -1) {
    throw new Error(
      `Pricing not found for ${product.name}, duration: ${duration}`,
    );
  }

  const updatedProduct = {
    ...product,
    pricing: product.pricing.map((p, index) => {
      if (index === pricingIndex) {
        const currentStock = isNaN(p.stock) ? 0 : p.stock;
        const newStock = Math.max(0, currentStock + change);
        return { ...p, stock: newStock };
      }
      return p;
    }),
  };

  products[productIndex] = updatedProduct;
  return updatedProduct;
};
