import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { DEFAULT_PRICING, fakeProducts } from "~/lib/fakeData";
import { formatPrice } from "~/lib/utils";
import { useUserStore } from "~/state/user.store";
import { type ProductType } from "~/types/product";
import PleaseLoginToView from "./PleaseLoginToView";
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
          price: z.string().min(1, { message: "Price is required" }),
        }),
      ),
    }),
  ),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductList = () => {
  const { user } = useUserStore();

  const [currentProducts, setCurrentProducts] =
    useState<ProductType[]>(fakeProducts);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      products: [], // Start with an empty array
    },
    mode: "all",
  });

  const {
    fields: productFields,
    append,
    replace,
  } = useFieldArray({
    control: form.control,
    name: "products",
  });

  useEffect(() => {
    const formattedProducts = fakeProducts.map((product) => ({
      keys: [],
      productName: product.name,
    }));

    replace(formattedProducts); // Set the initial products once
  }, [replace]);

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

  const addNewProduct = () => {
    const newProduct: ProductType = {
      name: "New Product",
      value: "new-product",
      pricing: DEFAULT_PRICING,
      stock: 999,
      uuid: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newProductForm = {
      productName: newProduct.name,
      keys: [],
    };

    append(newProductForm); // Append the new product to the form
    setCurrentProducts((currentProducts) => [...currentProducts, newProduct]);
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

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <div className="w-full rounded-md bg-green-400/80 p-4 text-sm text-green-50">
          <b>Note:</b> You can now proceed to checkout! Spend over $1200 to
          receive a $200 discount.
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button type="button" variant={"outline"} onClick={addNewProduct}>
          Test: Add New Product
        </Button>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {productFields.map((productField, productIndex) => {
              const product = currentProducts[productIndex];
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
              <span
                className="mx-2 flex-grow dark:invert"
                style={{
                  height: "1px", // Set height for the dashed line
                  backgroundImage: `url("data:image/svg+xml,%3csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3ccircle cx=\'1\' cy=\'1\' r=\'1\' fill=\'currentColor\'/%3e%3c/svg%3e")`,
                  backgroundSize: "8px 1px", // Adjust the spacing of the dashes
                  backgroundRepeat: "repeat-x", // Repeat the background image horizontally
                }}
              />
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

  // Calculate the current total quantity for this product
  const totalQuantityAdded = formValues.reduce((total, item) => {
    return total + (item.quantity || 0); // Sum up quantities
  }, 0);

  return (
    <Card className="mx-auto w-full">
      <CardHeader className="flex-row items-center justify-between gap-2 border-b py-4">
        <div>
          🔑 Product: <b>{product.name}</b>
        </div>
        <div>{product.stock} Keys Left</div>
      </CardHeader>
      <CardContent className="space-y-6 divide-y divide-dashed md:space-y-0 md:divide-y-0">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-4 pt-6">
            <KeyRow
              key={field.id}
              index={index}
              product={product}
              subtotal={calculateSubtotal(
                formValues[index]?.quantity ?? 1,
                formValues[index]?.price ?? "0",
              )}
              productIndex={productIndex}
            />
            {/* Remove KeyRow Button */}
            <Button
              type="button"
              className="col-span-1 shrink-0 text-destructive hover:underline"
              onClick={() => remove(index)}
              variant={"outline"}
              size={"icon"}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}

        <Button
          className="!mt-6"
          size={"sm"}
          variant={"secondary"}
          type="button"
          onClick={() =>
            append({
              quantity: 1,
              price: product.pricing?.[0]?.value ?? "0",
            })
          }
          disabled={product.stock === 0 || totalQuantityAdded >= product.stock}
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
};

const KeyRow = ({ product, subtotal, index, productIndex }: KeyRowProps) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<ProductFormValues>();

  const formValues = watch(`products.${productIndex}.keys`);

  // Calculate the current total quantity for this product
  const totalQuantityAdded = formValues.reduce((total, item) => {
    return total + item.quantity; // Sum up quantities
  }, 0);

  // Maximum allowable quantity for this row
  const maxQuantityForRow =
    product.stock - (totalQuantityAdded - (formValues[index]?.quantity ?? 0));

  const handleQuantityChange = (
    field: {
      value: number;
      onChange: (value: number) => void;
    },
    numericValue: number,
  ) => {
    // Allow decreasing the quantity
    if (numericValue < field.value) {
      return field.onChange(numericValue);
    }
    // Prevent increasing the quantity if total already meets/exceeds stock
    if (totalQuantityAdded >= product.stock && numericValue > field.value) {
      return; // Do not increase the quantity
    }
    // Ensure quantity does not exceed available stock
    if (numericValue > maxQuantityForRow) {
      return field.onChange(maxQuantityForRow);
    }
    // Update the quantity if valid
    field.onChange(numericValue);
  };

  return (
    <div className="grid w-full gap-4 md:grid-cols-3">
      {/* Quantity Input */}
      <Controller
        name={`products.${productIndex}.keys.${index}.quantity`}
        control={control}
        render={({ field }) => (
          <div className="flex flex-col">
            <Input
              {...field}
              className="col-span-1"
              placeholder="Quantity"
              type="number"
              min={1}
              max={product.stock}
              onChange={(e) => {
                const value = e.target.value;
                // Convert the value to a number
                const numericValue = value === "" ? 1 : Number(value);
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

      {/* Price Select */}
      <Controller
        name={`products.${productIndex}.keys.${index}.price`}
        control={control}
        render={({ field }) => (
          <div className="flex flex-col">
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="col-span-1">
                <SelectValue placeholder="Select Price" />
              </SelectTrigger>
              <SelectContent>
                {product.pricing.map((price) => (
                  <SelectItem key={price.name} value={price.value}>
                    {`${price.name} - ${price.value}`}
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

      {/* Subtotal Display */}
      <div className="col-span-1 flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
        <span>Subtotal: </span>
        <span>{subtotal}</span>
      </div>
    </div>
  );
};

export default ProductList;
