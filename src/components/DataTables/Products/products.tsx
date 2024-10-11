import { fakeProducts } from "~/lib/fakeData";
import { type ProductType } from "~/types/product";

export const products: Partial<ProductType>[] = fakeProducts.map(
  ({ createdAt, product, pricing, stock }) => {
    return {
      createdAt,
      product,
      pricing,
      stock,
    };
  },
);
