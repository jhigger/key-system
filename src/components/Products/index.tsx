import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import ProductsTable from "./table";

const Products = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          A list of products that can be purchased.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <ProductsTable />
      </CardContent>
    </Card>
  );
};

export default Products;
