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
