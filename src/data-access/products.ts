import { QueryClient } from "@tanstack/react-query";
import { fakeProducts } from "~/lib/fakeData";
import { type PricingType } from "~/types/pricing";
import { type ProductType } from "~/types/product";
import { getProductKeys } from "./productKeys";

export const getProducts = (): ProductType[] => fakeProducts;

export const editProduct = async (
  product: ProductType,
): Promise<ProductType> => {
  const products = getProducts();
  const oldProduct = findProductById(products, product.uuid);
  const updatedProduct = mergeProducts(oldProduct, product);

  // Update associated product keys
  await updateAssociatedProductKeys(oldProduct, updatedProduct);

  return updateProductInList(products, updatedProduct);
};

export const addProduct = async (
  product: ProductType,
): Promise<ProductType> => {
  const products = getProducts();
  products.push(product);
  return product;
};

export const deleteProduct = async (uuid: string): Promise<ProductType[]> => {
  const products = getProducts();
  const productKeys = getProductKeys();
  const updatedProducts = products.filter((product) => product.uuid !== uuid);
  const updatedProductKeys = productKeys.filter(
    (key) => key.productId !== uuid,
  );
  productKeys.length = 0;
  productKeys.push(...updatedProductKeys);
  products.length = 0;
  products.push(...updatedProducts);
  return updatedProducts;
};

export const editPricing = async (
  productUuid: string,
  newPricing: PricingType[],
): Promise<ProductType | null> => {
  const products = getProducts();
  const product = findProductById(products, productUuid);

  // Update the product's pricing with the new pricing
  const updatedProduct = {
    ...product,
    pricing: newPricing,
  };

  return updateProductInList(products, updatedProduct);
};

export const deletePricing = async (
  productUuid: string,
  pricingUuid: string,
): Promise<ProductType | null> => {
  const products = getProducts();
  const product = findProductById(products, productUuid);
  const updatedPricing = product.pricing.filter(
    (pricing) => pricing.uuid !== pricingUuid,
  );

  // Delete associated product keys
  const productKeys = getProductKeys();
  const updatedProductKeys = productKeys.filter(
    (key) => !(key.productId === productUuid && key.pricingId === pricingUuid),
  );

  // Update product keys
  productKeys.length = 0;
  productKeys.push(...updatedProductKeys);

  // Update the product
  const updatedProduct = updateProductPricing(
    products,
    product,
    updatedPricing,
  );

  // Invalidate product keys query
  const queryClient = new QueryClient();
  await queryClient.invalidateQueries({ queryKey: ["productKeys"] });

  return updatedProduct;
};

export const updateProductStock = async (
  productUuid: string,
  pricingUuid: string,
  change: number,
): Promise<ProductType> => {
  const products = getProducts();
  const product = findProductById(products, productUuid);
  const pricing = findPricingById(product.pricing, pricingUuid);
  const updatedPricing = updatePricingStock(pricing, change);
  return updateProductInList(products, {
    ...product,
    pricing: product.pricing.map((p) =>
      p.uuid === pricingUuid ? updatedPricing : p,
    ),
  });
};

// Helper functions
const findProductById = (
  products: ProductType[],
  uuid: string,
): ProductType => {
  const product = products.find((p) => p.uuid === uuid);
  if (!product) throw new Error(`Product ${uuid} not found`);
  return product;
};

const findPricingById = (pricing: PricingType[], uuid: string): PricingType => {
  const pricingItem = pricing.find((p) => p.uuid === uuid);
  if (!pricingItem) throw new Error(`Pricing ${uuid} not found`);
  return pricingItem;
};

const mergeProducts = (
  oldProduct: ProductType,
  newProduct: ProductType,
): ProductType => ({
  ...oldProduct,
  ...newProduct,
  pricing: newProduct.pricing.map((newPricing) => {
    const oldPricing = oldProduct.pricing.find(
      (p) => p.uuid === newPricing.uuid,
    );
    return {
      ...newPricing,
      stock: oldPricing?.stock ?? newPricing.stock,
    };
  }),
});

const updateProductInList = (
  products: ProductType[],
  updatedProduct: ProductType,
): ProductType => {
  const productIndex = products.findIndex(
    (p) => p.uuid === updatedProduct.uuid,
  );
  products[productIndex] = updatedProduct;
  return updatedProduct;
};

const updateProductPricing = (
  products: ProductType[],
  product: ProductType,
  updatedPricing: PricingType[],
): ProductType | null => {
  if (updatedPricing.length === 0) {
    const productIndex = products.findIndex((p) => p.uuid === product.uuid);
    products.splice(productIndex, 1);
    return null;
  } else {
    const updatedProduct = { ...product, pricing: updatedPricing };
    return updateProductInList(products, updatedProduct);
  }
};

const updatePricingStock = (
  pricing: PricingType,
  change: number,
): PricingType => ({
  ...pricing,
  stock: Math.max(0, (pricing.stock || 0) + change),
});

const updateAssociatedProductKeys = async (
  oldProduct: ProductType,
  newProduct: ProductType,
) => {
  const productKeys = getProductKeys();
  let updated = false;

  productKeys.forEach((key) => {
    if (key.productId === newProduct.uuid) {
      const oldPricing = oldProduct.pricing.find(
        (p) => p.uuid === key.pricingId,
      );
      if (oldPricing) {
        const newPricing = newProduct.pricing.find(
          (p) => p.duration === oldPricing.duration,
        );
        if (newPricing && newPricing.uuid !== key.pricingId) {
          key.pricingId = newPricing.uuid;
          updated = true;
        }
      }
    }
  });

  if (updated) {
    // Update the product keys in your data store
    // This assumes that getProductKeys() returns a reference to the actual array
    // If it returns a copy, you'll need to implement a way to update the original array
    productKeys.length = 0;
    productKeys.push(...productKeys);
  }
};
