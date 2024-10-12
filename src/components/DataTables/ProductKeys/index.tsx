import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { productKeys } from "./productKeys";
import ProductKeysTable from "./table";

const ProductKeys = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-y-1.5">
            <CardTitle>Product Keys</CardTitle>
            <CardDescription>
              A list of keys that can be purchased.
            </CardDescription>
          </div>
          <div className="flex flex-col items-end justify-between">
            <CardTitle>{productKeys.length}</CardTitle>
            <CardDescription>Total</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <ProductKeysTable />
      </CardContent>
    </Card>
  );
};

export default ProductKeys;
