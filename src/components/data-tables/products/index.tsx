import { Loader } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import useProducts from "~/hooks/useProducts";
import ProductsTable from "./table";

const Products = () => {
  const {
    query: { data: products, isLoading, isError },
  } = useProducts();

  if (isError) {
    return <div className="flex justify-center p-4">Error fetching data</div>;
  }

  return (
    <Card>
      {isLoading ? (
        <Loader className="p-4" />
      ) : (
        <>
          <CardHeader>
            <div className="flex justify-between gap-4">
              <div className="flex flex-col gap-y-1.5">
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  A list of products that can be activated.
                </CardDescription>
              </div>
              <div className="flex flex-col items-end justify-between">
                <CardTitle>{products?.length ?? 0}</CardTitle>
                <CardDescription>Total</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <ProductsTable />
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default Products;
