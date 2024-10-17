import { supabase } from "~/lib/initSupabase";
import { type PricingType } from "~/types/pricing";
import { type ProductType } from "~/types/product";

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

const getPricings = async (ids: string[]): Promise<PricingType[]> => {
  const { data: pricings, error: pricingError } = await supabase
    .from("pricings")
    .select("*")
    .in("uuid", ids);

  if (pricingError) {
    console.error("Error fetching pricings:", pricingError);
    throw new Error(pricingError.message);
  }

  return pricings;
};

export const editProduct = async (
  productUuid: string,
  product: ProductType,
): Promise<ProductType> => {
  const { data: productData, error: productError } = await supabase
    .from("products")
    .update({
      name: product.name,
      pricings: product.pricings.map((p) => p.uuid),
    })
    .eq("uuid", productUuid)
    .select()
    .single();

  if (productError) {
    console.error("Error updating product:", productError);
    throw new Error("Failed to update product");
  }

  const pricings = await getPricings(product.pricings.map((p) => p.uuid));

  const newProduct: ProductType = {
    uuid: productData.uuid,
    createdAt: productData.created_at,
    updatedAt: new Date().toISOString(),
    name: productData.name,
    pricings: pricings,
  };

  return newProduct;
};

export const addProduct = async (product: ProductType) => {
  const products = await getProducts();
  products.push(product);
  return product;
};

export const deleteProduct = async (uuid: string) => {
  // Delete associated product keys
  const { error: deleteKeysError } = await supabase
    .from("product_keys")
    .delete()
    .eq("product_id", uuid);

  if (deleteKeysError) {
    throw new Error("Failed to delete associated product keys");
  }

  // Delete the product from the database
  const { data: productData, error: deleteError } = await supabase
    .from("products")
    .delete()
    .eq("uuid", uuid)
    .select()
    .single();

  if (deleteError) {
    throw new Error("Failed to delete product");
  }

  // Delete associated pricings
  const { error: deletePricingsError } = await supabase
    .from("pricings")
    .delete()
    .in("uuid", productData?.pricings);

  if (deletePricingsError) {
    throw new Error("Failed to delete associated pricings");
  }
};

export const editPricing = async (
  pricingUuid: string,
  newPricing: PricingType,
) => {
  const { data: pricingData, error: pricingError } = await supabase
    .from("pricings")
    .update({
      duration: newPricing.duration,
      value: newPricing.value,
      stock: newPricing.stock,
    })
    .eq("uuid", pricingUuid)
    .select()
    .single();

  console.log("pricingData", pricingData);

  if (pricingError) {
    console.error("Error updating pricings:", pricingError);
    throw new Error("Failed to update pricings");
  }
};

export const deletePricing = async (
  productUuid: string,
  pricingUuid: string,
) => {
  // Delete the pricing
  const { error: deletePricingError } = await supabase
    .from("pricings")
    .delete()
    .eq("uuid", pricingUuid);

  if (deletePricingError) {
    throw new Error("Failed to delete pricing");
  }

  const pricings = await getProducts().then((products) =>
    products
      .find((p) => p.uuid === productUuid)
      ?.pricings.filter((p) => p.uuid !== pricingUuid)
      .map((p) => p.uuid),
  );

  console.log("pricings", pricings);

  if (pricings && pricings.length === 0) {
    return await deleteProduct(productUuid);
  }

  // Update the product's pricings array
  const { error: updateProductError } = await supabase
    .from("products")
    .update({
      pricings,
    })
    .eq("uuid", productUuid)
    .select()
    .single();

  if (updateProductError) {
    throw new Error("Failed to update product");
  }

  // Delete associated product keys
  const { error: deleteKeysError } = await supabase
    .from("product_keys")
    .delete()
    .eq("pricing_id", pricingUuid);

  if (deleteKeysError && deleteKeysError.code !== "PGRST116") {
    console.error("Error deleting product keys:", deleteKeysError);
    throw new Error("Failed to delete associated product keys");
  }
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
  // Update the pricing in the database
  const { error } = await supabase
    .from("pricings")
    .update({ stock: updatedPricing.stock })
    .eq("uuid", pricingUuid)
    .select();

  if (error) {
    throw new Error(`Failed to update pricing stock: ${error.message}`);
  }

  // Update the product in memory
  const updatedProduct = {
    ...product,
    pricings: product.pricings.map((p) =>
      p.uuid === pricingUuid ? updatedPricing : p,
    ),
  };

  return updatedProduct;
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

const updatePricingStock = (
  pricing: PricingType,
  change: number,
): PricingType => ({
  ...pricing,
  stock: Math.max(0, (pricing.stock || 0) + change),
});
