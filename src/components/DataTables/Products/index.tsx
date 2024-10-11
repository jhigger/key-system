import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { products } from "./products";
import ProductsTable from "./table";

const Products = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-y-1.5">
            <CardTitle>Products</CardTitle>
            <CardDescription>
              A list of products that can be purchased.
            </CardDescription>
          </div>
          <div className="flex flex-col items-end justify-between">
            <CardTitle>{products.length}</CardTitle>
            <CardDescription>Total</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <ProductsTable />
      </CardContent>
    </Card>
  );
};

export default Products;
