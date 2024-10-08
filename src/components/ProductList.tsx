import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type ProductType = {
  name: string;
  value: string;
  pricing: {
    name: string;
    value: string;
  }[];
};

const DEFAULT_PRICING = [
  { name: "1 Day - $1.50", value: "1.5" },
  { name: "3 Days - $3.00", value: "3" },
  { name: "7 Days - $5.00", value: "5" },
  { name: "30 Days - $13.00", value: "13" },
  { name: "Lifetime - $150.00", value: "150" },
];

const PRODUCTS: ProductType[] = [
  {
    name: "Distortion",
    value: "distortion",
    pricing: DEFAULT_PRICING,
  },
  {
    name: "Densho",
    value: "densho",
    pricing: DEFAULT_PRICING,
  },
  {
    name: "Unlock All",
    value: "unlock-all",
    pricing: DEFAULT_PRICING,
  },
];

const ProductList = () => {
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <div className="w-full rounded-md bg-green-400/80 p-4 text-sm text-green-50">
          <b>Note:</b> You can now proceed to checkout! Spend over $1200 to
          receive a $200 discount.
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.value} product={product} />
          ))}
        </div>
        <Button className="w-full">Proceed to checkout</Button>
      </CardContent>
    </Card>
  );
};

type ProductCardProps = { product: ProductType };

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader className="flex-row gap-2 border-b py-4">
        🔑 Product: <b>{product.name}</b>
      </CardHeader>
      <CardContent className="space-y-6 divide-y divide-dashed md:space-y-0 md:divide-y-0">
        <KeyRow product={product} />
        <Button className="!mt-6" size={"sm"} variant={"secondary"}>
          ➕ Add Key
        </Button>
      </CardContent>
    </Card>
  );
};

type KeyRowProps = { product: ProductType };

const KeyRow = ({ product }: KeyRowProps) => {
  return (
    <div className="grid gap-4 pt-6 md:grid-cols-3">
      <Input
        className="col-span-1"
        placeholder="Quantity"
        type="number"
        defaultValue={1}
      />

      <Select defaultValue="1.5">
        <SelectTrigger className="col-span-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {product.pricing.map((price) => (
            <SelectItem key={price.name} value={price.value}>
              {price.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
        <span>Subtotal:</span>
        <span>$69.00</span>
      </div>
    </div>
  );
};

export default ProductList;
