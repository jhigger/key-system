import { fakeProducts } from "~/lib/fakeData";
import { type ProductType } from "~/types/product";

export const getProducts = (): ProductType[] => fakeProducts;

export const editProduct = (product: ProductType) => {
  const index = fakeProducts.findIndex((p) => p.uuid === product.uuid);
  if (index !== -1) {
    // Create a new object with the updated values
    const updatedProduct = { ...fakeProducts[index], ...product };
    // Replace the old object with the new one
    fakeProducts[index] = updatedProduct;
    return updatedProduct;
  }
  throw new Error(`Product ${product.name} not found`);
};

export const addProduct = (product: ProductType) => {
  fakeProducts.push(product);
};

export const deleteProduct = (uuid: string): ProductType[] => {
  const index = fakeProducts.findIndex((product) => product.uuid === uuid);
  if (index !== -1) {
    fakeProducts.splice(index, 1);
  }
  return fakeProducts;
};

export const deletePricing = (
  productUuid: string,
  pricingUuid: string,
): ProductType => {
  const productIndex = fakeProducts.findIndex(
    (product) => product.uuid === productUuid,
  );
  if (productIndex === -1) {
    throw new Error(`Product ${productUuid} not found`);
  }

  const product = fakeProducts[productIndex];
  if (!product) {
    throw new Error(`Product ${productUuid} not found`);
  }

  const updatedPricing = product.pricing.filter(
    (pricing) => pricing.uuid !== pricingUuid,
  );

  if (updatedPricing.length === product.pricing.length) {
    throw new Error(`Pricing ${pricingUuid} not found`);
  }

  const updatedProduct = { ...product, pricing: updatedPricing };
  fakeProducts[productIndex] = updatedProduct;

  return updatedProduct;
};
