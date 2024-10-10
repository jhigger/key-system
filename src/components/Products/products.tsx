import { fakeProducts } from "~/lib/fakeData";
import { type ProductType } from "~/types/product";

export const products: Partial<ProductType>[] = fakeProducts.map(
  ({ name, pricing, stock }) => {
    return {
      name,
      pricing,
      stock,
    };
  },
);
