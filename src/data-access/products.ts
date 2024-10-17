import { QueryClient } from "@tanstack/react-query";
import { supabase } from "~/lib/initSupabase";
import { type PricingType } from "~/types/pricing";
import { type ProductType } from "~/types/product";
import { getProductKeys } from "./productKeys";

export const getProducts = async (): Promise<ProductType[]> => {
  const { data: products, error: productError } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (productError) {
    console.error("Error fetching products:", productError);
    throw new Error(productError.message);
  }

  const productIds = products.map((product) => product.pricings).flat();
  const { data: pricings, error: pricingError } = await supabase
    .from("pricings")
    .select("*")
    .in("uuid", productIds);

  if (pricingError) {
    console.error("Error fetching pricings:", pricingError);
    throw new Error(pricingError.message);
  }

  if (!pricings) {
    throw new Error("No pricing data returned");
  }

  const productsWithPricing = products.map(
    (product): ProductType => ({
      uuid: product.uuid,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      name: product.name,
      pricings: pricings
        .filter((pricing) => product?.pricings?.includes(pricing.uuid))
        .sort((a, b) => {
          // Place zero duration (Lifetime) at the bottom
          if (a.duration === 0) return 1;
          if (b.duration === 0) return -1;
          // Sort other durations in ascending order
          return a.duration - b.duration;
        }),
    }),
  );

  return productsWithPricing;
};

export const editProduct = async (
  product: ProductType,
): Promise<ProductType> => {
  const products = await getProducts();
  const oldProduct = findProductById(products, product.uuid);
  const updatedProduct = mergeProducts(oldProduct, product);

  // Update associated product keys
  await updateAssociatedProductKeys(oldProduct, updatedProduct);

  return updateProductInList(products, updatedProduct);
};

export const addProduct = async (
  product: ProductType,
): Promise<ProductType> => {
  const products = await getProducts();
  products.push(product);
  return product;
};

export const deleteProduct = async (uuid: string): Promise<ProductType[]> => {
  const products = await getProducts();
  const productKeys = await getProductKeys();
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
  const products = await getProducts();
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
  const products = await getProducts();
  const product = findProductById(products, productUuid);
  const updatedPricing = product.pricings.filter(
    (pricing) => pricing.uuid !== pricingUuid,
  );

  // Delete associated product keys
  const productKeys = await getProductKeys();
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
  const products = await getProducts();
  const product = findProductById(products, productUuid);
  const pricing = findPricingById(product.pricings, pricingUuid);
  const updatedPricing = updatePricingStock(pricing, change);
  return updateProductInList(products, {
    ...product,
    pricings: product.pricings.map((p) =>
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
  pricings: newProduct.pricings.map((newPricing) => {
    const oldPricing = oldProduct.pricings.find(
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
  const productKeys = await getProductKeys();
  let updated = false;

  productKeys.forEach((key) => {
    if (key.productId === newProduct.uuid) {
      const oldPricing = oldProduct.pricings.find(
        (p) => p.uuid === key.pricingId,
      );
      if (oldPricing) {
        const newPricing = newProduct.pricings.find(
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
