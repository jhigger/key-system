import { supabase } from "~/lib/initSupabase";
import { type PricingType } from "~/types/pricing";
import { type ProductType } from "~/types/product";

export const getProducts = async (
  getToken: () => Promise<string | null>,
): Promise<ProductType[]> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { data: products, error: productError } = await supabase(token)
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (productError) {
    throw new Error(productError.message);
  }

  const productIds = products.map((product) => product.pricings).flat();
  const { data: pricings, error: pricingError } = await supabase(token)
    .from("pricings")
    .select("*")
    .in("uuid", productIds);

  if (pricingError) {
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
      category: product.category,
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
  getToken: () => Promise<string | null>,
  productUuid: string,
  product: ProductType,
): Promise<ProductType> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { data: productData, error: productError } = await supabase(token)
    .from("products")
    .update({
      name: product.name,
      pricings: product.pricings.map((p) => p.uuid),
      category: product.category,
    })
    .eq("uuid", productUuid)
    .select()
    .single();

  if (productError) {
    throw new Error("Failed to update product");
  }

  const { data: pricings, error: pricingError } = await supabase(token)
    .from("pricings")
    .upsert(product.pricings)
    .in(
      "uuid",
      product.pricings.map((p) => p.uuid),
    )
    .select();

  if (pricingError) {
    throw new Error(pricingError.message);
  }

  const newProduct: ProductType = {
    uuid: productData.uuid,
    createdAt: productData.created_at,
    updatedAt: new Date().toISOString(),
    category: productData.category,
    name: productData.name,
    pricings: pricings,
  };

  return newProduct;
};

export const addProduct = async (
  getToken: () => Promise<string | null>,
  product: ProductType,
): Promise<ProductType> => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { error: productError } = await supabase(token)
    .from("products")
    .insert({
      name: product.name,
      pricings: product.pricings.map((p) => p.uuid),
      category: product.category,
    })
    .single();

  if (productError) {
    throw new Error("Failed to add product");
  }

  const { error: pricingError } = await supabase(token)
    .from("pricings")
    .insert(
      product.pricings.map((p) => ({
        uuid: p.uuid,
        duration: p.duration,
        value: p.value,
      })),
    );

  if (pricingError) {
    throw new Error("Failed to add pricings");
  }

  return product;
};

export const deleteProduct = async (
  getToken: () => Promise<string | null>,
  uuid: string,
) => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  // Delete associated product keys
  const { error: deleteKeysError } = await supabase(token)
    .from("product_keys")
    .delete()
    .eq("product_id", uuid);

  if (deleteKeysError) {
    throw new Error("Failed to delete associated product keys");
  }

  // Delete the product from the database
  const { data: productData, error: deleteError } = await supabase(token)
    .from("products")
    .delete()
    .eq("uuid", uuid)
    .select()
    .single();

  if (deleteError) {
    throw new Error("Failed to delete product");
  }

  // Delete associated pricings
  const { error: deletePricingsError } = await supabase(token)
    .from("pricings")
    .delete()
    .in("uuid", productData?.pricings);

  if (deletePricingsError) {
    throw new Error("Failed to delete associated pricings");
  }
};

export const editPricing = async (
  getToken: () => Promise<string | null>,
  pricingUuid: string,
  newPricing: PricingType,
) => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  const { error: pricingError } = await supabase(token)
    .from("pricings")
    .update({
      duration: newPricing.duration,
      value: newPricing.value,
    })
    .eq("uuid", pricingUuid)
    .select()
    .single();

  if (pricingError) {
    throw new Error("Failed to update pricings");
  }
};

export const deletePricing = async (
  getToken: () => Promise<string | null>,
  productUuid: string,
  pricingUuid: string,
) => {
  const token = await getToken();
  if (!token) {
    throw new Error("No token provided");
  }

  // Delete associated product keys
  const { error: deleteKeysError } = await supabase(token)
    .from("product_keys")
    .delete()
    .eq("pricing_id", pricingUuid);

  if (deleteKeysError && deleteKeysError.code !== "PGRST116") {
    throw new Error("Failed to delete associated product keys");
  }

  // Delete the pricing
  const { error: deletePricingError } = await supabase(token)
    .from("pricings")
    .delete()
    .eq("uuid", pricingUuid);

  if (deletePricingError) {
    throw new Error("Failed to delete pricing");
  }

  const pricings = await getProducts(getToken).then((products) =>
    products
      .find((p) => p.uuid === productUuid)
      ?.pricings.filter((p) => p.uuid !== pricingUuid)
      .map((p) => p.uuid),
  );

  if (pricings && pricings.length === 0) {
    return await deleteProduct(getToken, productUuid);
  }

  // Update the product's pricings array
  const { error: updateProductError } = await supabase(token)
    .from("products")
    .update({
      pricings,
    })
    .eq("uuid", productUuid);

  if (updateProductError) {
    throw new Error("Failed to update product");
  }
};
