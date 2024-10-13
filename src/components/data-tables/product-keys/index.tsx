import { Loader } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import useProductKeys from "~/hooks/useProductKeys";
import ProductKeysTable from "./table";

const ProductKeys = () => {
  const {
    query: { data: productKeys, isLoading, isError },
  } = useProductKeys();

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
                <CardTitle>Product Keys</CardTitle>
                <CardDescription>
                  A list of keys that can be purchased.
                </CardDescription>
              </div>
              <div className="flex flex-col items-end justify-between">
                <CardTitle>{productKeys?.length ?? 0}</CardTitle>
                <CardDescription>Total</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <ProductKeysTable />
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default ProductKeys;
