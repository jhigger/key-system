import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";
import useProducts from "~/hooks/useProducts";
import { formatDuration, formatPrice } from "~/lib/utils";
import { useUserStore } from "~/state/user.store";
import { type ProductType } from "~/types/product";
import DottedLine from "./dotted-line";
import Loader from "./loader";
import PleaseLoginToView from "./please-login-to-view";
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

const productSchema = z.object({
  products: z.array(
    z.object({
      productName: z.string(),
      keys: z.array(
        z.object({
          quantity: z
            .number({ invalid_type_error: "Quantity must be a number" })
            .min(1, { message: "Quantity must be at least 1" }),
          price: z.number().min(1, { message: "Price is required" }),
          duration: z.number(),
        }),
      ),
    }),
  ),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductList = () => {
  const { user } = useUserStore();

  const {
    query: { data: products, isLoading },
  } = useProducts();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      products: [], // Start with an empty array
    },
    mode: "all",
  });

  const { fields: productFields, replace } = useFieldArray({
    control: form.control,
    name: "products",
  });

  useEffect(() => {
    const formattedProducts = products?.map((product) => ({
      keys: [],
      productName: product.name,
    }));

    replace(formattedProducts ?? []); // Set the initial products once
  }, [replace, products]);

  const onSubmit = (data: ProductFormValues) => {
    const filteredData = data.products.filter(
      (product) => product.keys.length > 0,
    );

    // Combine similar price levels
    const cart = filteredData.map((product) => {
      const priceGroups = product.keys.reduce<
        Record<string, { quantity: number }>
      >((acc, key) => {
        const price = key.price;
        if (!acc[price]) {
          acc[price] = { quantity: 0 };
        }
        acc[price].quantity += key.quantity; // Sum quantities for the same price
        return acc;
      }, {});

      return {
        name: product.productName,
        keys: Object.entries(priceGroups).map(([price, { quantity }]) => ({
          quantity,
          price: Number(price),
        })),
        totalPrice: Object.entries(priceGroups).reduce(
          (acc, [price, { quantity }]) => acc + quantity * Number(price),
          0,
        ),
      };
    });

    console.log("Submitted Data", cart);
  };

  const calculateTotal = (products: ProductFormValues["products"]) => {
    return products.reduce((total, product) => {
      return (
        total +
        product.keys.reduce(
          (acc, key) => acc + Number(key.price) * key.quantity,
          0,
        )
      );
    }, 0);
  };

  if (!user) {
    return <PleaseLoginToView />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <div className="w-full rounded-md bg-green-500/80 p-4 text-sm text-green-50">
          <b>Note:</b> You can now proceed to checkout! Spend over $1200 to
          receive a $200 discount.
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {productFields.map((productField, productIndex) => {
              const product = products?.[productIndex];
              if (!product) return null;

              return (
                <ProductCard
                  key={productField.id}
                  product={product}
                  productIndex={productIndex}
                />
              );
            })}

            <div className="flex w-full items-baseline justify-between">
              <span>Total</span>
              <DottedLine />
              <span className="font-bold">
                {formatPrice(calculateTotal(form.watch("products")))}
              </span>
            </div>

            <Button
              className="w-full"
              type="submit"
              disabled={
                form.formState.isSubmitting ||
                calculateTotal(form.watch("products")) <= 0
              }
            >
              Proceed to checkout
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

type ProductCardProps = {
  product: ProductType;
  productIndex: number;
};

const ProductCard = ({ product, productIndex }: ProductCardProps) => {
  const { control, watch } = useFormContext<ProductFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `products.${productIndex}.keys`,
  });

  const formValues = watch(`products.${productIndex}.keys`);

  const calculateSubtotal = (quantity: number, price: string) =>
    formatPrice(Number(price) * quantity);

  // Calculate remaining stock for each pricing option
  const remainingStock = product.pricing.reduce(
    (acc, price) => {
      const totalQuantity = formValues.reduce((sum, key) => {
        if (key.price === price.value && key.duration === price.duration) {
          return sum + (key.quantity || 0);
        }
        return sum;
      }, 0);
      acc[`${price.value}-${price.duration}`] = price.stock - totalQuantity;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Find the first available pricing option
  const firstAvailableOption = product.pricing.find(
    (price) => remainingStock[`${price.value}-${price.duration}`] ?? 0 > 0,
  );

  return (
    <Card className="mx-auto w-full">
      <CardHeader className="flex-row items-center justify-between gap-2 border-b py-4">
        <div>
          🔑 Product: <b>{product.name}</b>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 divide-y divide-dashed pt-6 md:divide-solid">
        {fields.map((field, index) => (
          <KeyRow
            key={field.id}
            index={index}
            product={product}
            subtotal={calculateSubtotal(
              formValues[index]?.quantity ?? 1,
              formValues[index]?.price.toString() ?? "0",
            )}
            productIndex={productIndex}
            remainingStock={remainingStock}
            onRemove={() => remove(index)}
          />
        ))}

        <Button
          className="!mt-6"
          size={"sm"}
          variant={"secondary"}
          type="button"
          onClick={() => {
            if (firstAvailableOption) {
              append({
                quantity: 1,
                price: firstAvailableOption.value,
                duration: firstAvailableOption.duration,
              });
            }
          }}
          disabled={!firstAvailableOption}
        >
          ➕ Add Key
        </Button>
      </CardContent>
    </Card>
  );
};

type KeyRowProps = {
  product: ProductType;
  subtotal: string;
  index: number;
  productIndex: number;
  remainingStock: Record<string, number>;
  onRemove: () => void;
};

const KeyRow = ({
  product,
  subtotal,
  index,
  productIndex,
  remainingStock,
  onRemove,
}: KeyRowProps) => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ProductFormValues>();

  const currentPrice = watch(`products.${productIndex}.keys.${index}.price`);
  const currentDuration = watch(
    `products.${productIndex}.keys.${index}.duration`,
  );

  // Find the current pricing option
  const currentPricingOption = product.pricing.find(
    (p) => p.value === currentPrice && p.duration === currentDuration,
  );

  const handleQuantityChange = (
    field: {
      value: number;
      onChange: (value: number) => void;
    },
    newValue: number,
  ) => {
    const maxAllowedQuantity =
      remainingStock[`${currentPrice}-${currentDuration}`] ?? 0 + field.value;
    const validValue = Math.min(Math.max(1, newValue), maxAllowedQuantity);
    field.onChange(validValue);
  };

  const handleRemove = () => {
    onRemove();
  };

  return (
    <div className="flex flex-col gap-2 rounded-md border !border-b border-muted bg-transparent p-3">
      <div className="flex h-9 items-center justify-center gap-2 text-sm text-muted-foreground shadow-sm">
        <span>
          {`${formatDuration(currentDuration)} - $${currentPrice}`} keys left:
        </span>
        <span className="text-foreground">
          {Math.max(
            0,
            remainingStock[`${currentPrice}-${currentDuration}`] ?? 0,
          )}
        </span>
      </div>

      <div className="grid w-full gap-4 md:grid-cols-11">
        {/* Price Select */}
        <Controller
          name={`products.${productIndex}.keys.${index}.price`}
          control={control}
          render={({ field }) => (
            <div className="col-span-full flex flex-col md:col-span-3">
              <Select
                value={field.value.toString()}
                onValueChange={(value) => {
                  const selectedPricing = product.pricing.find(
                    (p) => p.value.toString() === value,
                  );
                  field.onChange(Number(value));
                  if (selectedPricing) {
                    setValue(
                      `products.${productIndex}.keys.${index}.duration`,
                      selectedPricing.duration,
                    );
                    // Reset quantity to 1 when changing price
                    setValue(
                      `products.${productIndex}.keys.${index}.quantity`,
                      1,
                    );
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Price">
                    {currentPricingOption
                      ? `${formatDuration(currentPricingOption.duration)} - $${
                          currentPricingOption.value
                        }`
                      : "Select Price"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {product.pricing
                    .filter(
                      (price) =>
                        remainingStock[`${price.value}-${price.duration}`] ??
                        0 > 0,
                    )
                    .map((price) => (
                      <SelectItem
                        key={`${price.value}-${price.duration}`}
                        value={price.value.toString()}
                      >
                        {`${formatDuration(price.duration)} - $${price.value}`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.products?.[productIndex]?.keys?.[index]?.price && (
                <span className="text-sm text-destructive">
                  {errors.products[productIndex].keys[index].price?.message}
                </span>
              )}
            </div>
          )}
        />

        {/* Quantity Input */}
        <Controller
          name={`products.${productIndex}.keys.${index}.quantity`}
          control={control}
          render={({ field }) => (
            <div className="col-span-full flex flex-col md:col-span-3">
              <Input
                {...field}
                placeholder="Quantity"
                type="number"
                min={1}
                max={currentPricingOption?.stock ?? 0}
                onChange={(e) => {
                  const numericValue =
                    e.target.value === "" ? 1 : Number(e.target.value);
                  handleQuantityChange(field, numericValue);
                }}
              />
              {errors.products?.[productIndex]?.keys?.[index]?.quantity && (
                <span className="text-sm text-destructive">
                  {errors.products[productIndex].keys[index].quantity?.message}
                </span>
              )}
            </div>
          )}
        />

        {/* Subtotal Display */}
        <div className="col-span-full flex h-9 w-full items-end justify-between rounded-md bg-transparent px-3 py-1 text-sm shadow-sm md:col-span-4">
          <div className="flex w-full items-baseline justify-between">
            <span>Subtotal</span>
            <DottedLine />
            <span>{subtotal}</span>
          </div>
        </div>

        {/* Remove KeyRow Button */}
        <Button
          type="button"
          className="col-span-full shrink-0 hover:bg-destructive/80 md:col-span-1"
          onClick={handleRemove}
          variant={"ghost"}
          size={"icon"}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductList;
