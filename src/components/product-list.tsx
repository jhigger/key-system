import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { type Database } from "database.types";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import useAdminOptions from "~/hooks/useAdminOptions";
import useAuthToken from "~/hooks/useAuthToken";
import useCategories from "~/hooks/useCategories";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import useProductKeys from "~/hooks/useProductKeys";
import useProducts from "~/hooks/useProducts";
import { supabase } from "~/lib/initSupabase";
import { formatDuration, formatPrice } from "~/lib/utils";
import { type CreateInvoiceData } from "~/pages/api/create-invoice";
import { type ProductType } from "~/types/product";
import DottedLine from "./dotted-line";
import Loader from "./loader";
import PendingApproval from "./pending-approval";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const productSchema = z.object({
  products: z.array(
    z.object({
      category: z.string().nullable(),
      productName: z.string(),
      keys: z.array(
        z.object({
          quantity: z
            .number({ invalid_type_error: "Quantity must be a number" })
            .min(1, { message: "Quantity must be at least 1" }),
          pricingUuid: z.string().min(1, { message: "Pricing is required" }),
        }),
      ),
    }),
  ),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductList = () => {
  const [currentCategory, setCurrentCategory] = useState({
    label: "",
    value: "",
  }); // State for the selected category
  const [isCheckout, setIsCheckout] = useState(false);
  const getToken = useAuthToken();
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useCurrentUser();

  const {
    query: { data: categories, isLoading: isCategoriesLoading },
  } = useCategories();

  const {
    query: { data: products, isLoading: isProductsLoading },
    query: { data: productsData },
    pricingsQuery: { data: pricingsData, isLoading: isPricingsLoading },
  } = useProducts();

  const {
    query: { data: productKeys, isLoading: isProductKeysLoading },
  } = useProductKeys();

  const {
    query: { data: adminOptions, isLoading: isAdminOptionsLoading },
  } = useAdminOptions();

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
    if (products && productFields.length === 0) {
      const formattedProducts = products.map((product) => ({
        keys: [],
        productName: product.name,
        category: product.category,
      }));
      replace(formattedProducts);
    }
  }, [replace, products, productFields.length]);

  useEffect(() => {
    if (categories && !isCategoriesLoading) {
      setCurrentCategory({
        label: categories[0]?.name ?? "",
        value: categories[0]?.uuid ?? "",
      });
    }
  }, [categories, isCategoriesLoading]);

  const onSubmit = async (data: ProductFormValues) => {
    if (!user) return;

    const token = await getToken();
    if (!token) return;

    const filteredData = data.products.filter(
      (product) => product.keys.length > 0,
    );

    // Combine similar pricing levels
    const cart = filteredData.map((product) => {
      const priceGroups = product.keys.reduce<
        Record<string, { quantity: number; pricingUuid: string }>
      >((acc, key) => {
        if (!acc[key.pricingUuid]) {
          acc[key.pricingUuid] = { quantity: 0, pricingUuid: key.pricingUuid };
        }
        acc[key.pricingUuid]!.quantity += key.quantity;
        return acc;
      }, {});

      return {
        productName: product.productName,
        keys: Object.values(priceGroups),
        totalPrice: Object.entries(priceGroups).reduce(
          (acc, [pricingUuid, { quantity }]) => {
            const pricing = products
              ?.find((p) => p.name === product.productName)
              ?.pricings.find((p) => p.uuid === pricingUuid);
            return acc + (pricing?.value ?? 0) * quantity;
          },
          0,
        ),
      };
    });

    const totalCartPrice = cart.reduce(
      (acc, product) => acc + product.totalPrice,
      0,
    );

    const minPurchase = adminOptions?.find(
      (o) => o.name === "Minimum Purchase",
    );

    if (!minPurchase) {
      toast.error("Minimum purchase not found in admin options");
      return;
    }

    if (totalCartPrice < Number(minPurchase?.value)) {
      toast.warning(
        `Purchase total must be at least $${Number(minPurchase?.value)}`,
      );
      return;
    }

    const orderUUID = uuidv4();
    const usedKeys = new Set<string>();

    const productKeySnapshots: Database["public"]["Tables"]["product_keys_snapshots"]["Insert"][] =
      cart.flatMap(
        (
          product,
        ): Database["public"]["Tables"]["product_keys_snapshots"]["Insert"][] => {
          return product.keys.flatMap(
            (
              keyRequest,
            ): Database["public"]["Tables"]["product_keys_snapshots"]["Insert"][] => {
              const pricing = pricingsData?.find(
                (p) => p.uuid === keyRequest.pricingUuid,
              );
              const availableKeys =
                productKeys?.filter(
                  (p) =>
                    p.pricingId === keyRequest.pricingUuid &&
                    !usedKeys.has(p.key),
                ) ?? [];

              if (!pricing || availableKeys.length < keyRequest.quantity) {
                console.error(
                  `Not enough keys available for ${product.productName}`,
                );
                toast.error(
                  `Not enough keys available for ${product.productName}`,
                );
                return [];
              }

              return Array.from({ length: keyRequest.quantity }, () => {
                const productKey = availableKeys.pop();
                if (!productKey) {
                  console.error(
                    `Unexpected: No key available for ${product.productName}`,
                  );
                  return null;
                }
                usedKeys.add(productKey.key);

                return {
                  uuid: uuidv4(),
                  product_name: product.productName,
                  key: productKey.key,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  owner: user.uuid,
                  pricing: pricing,
                  hardware_id: null,
                  expiry: pricing.duration
                    ? new Date(
                        new Date().getTime() +
                          pricing.duration * 24 * 60 * 60 * 1000,
                      ).toISOString()
                    : null,
                  order_id: orderUUID,
                };
              }).filter(
                (item): item is NonNullable<typeof item> => item !== null,
              );
            },
          );
        },
      );

    const operations: (
      | {
          type: "decrement_stock";
          pricing_uuid: string;
          amount: number;
        }
      | {
          type: "update_reserved";
          key: string;
          reserved: boolean;
        }
    )[] = [];

    // Update stock for each pricing
    for (const product of cart) {
      for (const keyRequest of product.keys) {
        operations.push({
          type: "decrement_stock",
          pricing_uuid: keyRequest.pricingUuid,
          amount: keyRequest.quantity,
        });
      }
    }

    // Update reserved for each key
    for (const productKey of productKeySnapshots) {
      operations.push({
        type: "update_reserved",
        key: productKey.key,
        reserved: true,
      });
    }

    const { error: batchError } = await supabase(token).rpc(
      "batch_operations",
      {
        operations,
      },
    );
    if (batchError) {
      console.error("Error during batch operations:", batchError);
      toast.error("Something went wrong");
      return; // Exit if there's an error
    }

    const body: CreateInvoiceData = {
      amount: calculateTotal(form.watch("products")).toString(),
      order_uuid: orderUUID,
      productKeySnapshots,
      user_uuid: user.uuid,
    };

    const res = await axios
      .post("/api/create-invoice", body)
      .catch(async (err) => {
        const operationsOnError: (
          | {
              type: "increment_stock";
              pricing_uuid: string;
              amount: number;
            }
          | {
              type: "update_reserved";
              key: string;
              reserved: boolean;
            }
        )[] = [];

        // Update stock for each pricing
        for (const product of cart) {
          for (const keyRequest of product.keys) {
            operationsOnError.push({
              type: "increment_stock",
              pricing_uuid: keyRequest.pricingUuid,
              amount: keyRequest.quantity,
            });
          }
        }

        // Update reserved for each key
        for (const productKey of productKeySnapshots) {
          operationsOnError.push({
            type: "update_reserved",
            key: productKey.key,
            reserved: false,
          });
        }

        const { error: batchError } = await supabase(token).rpc(
          "batch_operations",
          {
            operations,
          },
        );
        if (batchError) {
          console.error("Error during batch operations:", batchError);
          return; // Exit if there's an error
        }

        console.error(err);
        toast.error("An error occurred while creating the invoice");
      });

    const responseData = res?.data as { checkoutLink: string };

    if (responseData) {
      setIsCheckout(true);
      await router.push(responseData.checkoutLink);
    }
  };

  const calculateTotal = (products: ProductFormValues["products"]) => {
    return products.reduce((total, product) => {
      return (
        total +
        product.keys.reduce((acc, key) => {
          const pricing = productsData
            ?.find((p) => p.name === product.productName)
            ?.pricings.find((p) => p.uuid === key.pricingUuid);
          return acc + (pricing?.value ?? 0) * key.quantity;
        }, 0)
      );
    }, 0);
  };

  const handleCategoryChange = (value: string) => {
    const categoryName =
      categories?.find((category) => category.uuid === value)?.name ?? "All";
    setCurrentCategory({ label: categoryName, value });
  };

  if (
    isUserLoading ||
    isCategoriesLoading ||
    isProductsLoading ||
    isPricingsLoading ||
    isProductKeysLoading ||
    isAdminOptionsLoading ||
    isCheckout
  ) {
    return <Loader />;
  }

  if (!user) {
    return <PleaseLoginToView />;
  }

  if (user.approvedBy === null) {
    return <PendingApproval />;
  }

  if (products?.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        No keys available
      </div>
    );
  }

  return (
    <Tabs
      defaultValue={categories?.[0]?.uuid}
      className="w-full max-w-screen-lg grow"
      value={currentCategory.value}
    >
      {categories && (
        <TabsList className="flex h-fit w-full flex-wrap">
          {categories.map(({ uuid, name }) => (
            <TabsTrigger
              key={uuid}
              value={uuid}
              className="flex flex-1 items-center justify-center gap-2"
              onClick={() => {
                handleCategoryChange(uuid);
              }}
            >
              {name}
            </TabsTrigger>
          ))}
        </TabsList>
      )}
      <TabsContent value={currentCategory.value}>
        <Card className="mx-auto w-full max-w-screen-lg">
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
                {productFields
                  .filter((productField) => {
                    return productField.category === currentCategory.value;
                  })
                  .map((productField, productIndex) => {
                    const product = products?.find(
                      (p) => p.name === productField.productName,
                    );
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

                {user.role !== "admin" && (
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={
                      form.formState.isSubmitting ||
                      calculateTotal(form.watch("products")) <= 0
                    }
                  >
                    {form.formState.isSubmitting ? (
                      <Loader />
                    ) : (
                      "Proceed to checkout"
                    )}
                  </Button>
                )}
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
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

  const calculateSubtotal = (quantity: number, pricingUuid: string) => {
    const pricing = product.pricings.find((p) => p.uuid === pricingUuid);
    return formatPrice((pricing?.value ?? 0) * quantity);
  };

  // Calculate remaining stock for each pricing option
  const remainingStock = product.pricings.reduce(
    (acc, price) => {
      const totalQuantity = formValues.reduce((sum, key) => {
        if (key.pricingUuid === price.uuid) {
          return sum + (key.quantity || 0);
        }
        return sum;
      }, 0);
      acc[price.uuid] = price.stock - totalQuantity;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Find the first available pricing option
  const firstAvailableOption = product.pricings.find(
    (price) => remainingStock[price.uuid] ?? 0 > 0,
  );

  return (
    <Card className="mx-auto w-full">
      <CardHeader className="flex-row items-center justify-between gap-2 border-b py-4">
        <div>
          🔑 Product: <b>{product.name}</b>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 divide-y divide-dashed md:divide-solid">
        {fields.map((field, index) => (
          <KeyRow
            key={field.id}
            index={index}
            product={product}
            subtotal={calculateSubtotal(
              formValues[index]?.quantity ?? 1,
              formValues[index]?.pricingUuid ?? "",
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
                pricingUuid: firstAvailableOption.uuid,
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

  const currentPricingUuid = watch(
    `products.${productIndex}.keys.${index}.pricingUuid`,
  );

  // Find the current pricing option
  const currentPricingOption = product.pricings.find(
    (p) => p.uuid === currentPricingUuid,
  );

  const handleQuantityChange = (
    field: {
      value: number;
      onChange: (value: number) => void;
    },
    newValue: number,
  ) => {
    const currentStock = remainingStock[currentPricingUuid] ?? 0;
    const maxAllowedQuantity = currentStock + field.value;

    // Check if we're increasing the value
    if (newValue > field.value) {
      // Only allow increase if there's remaining stock
      if (currentStock > 0) {
        const validValue = Math.min(newValue, maxAllowedQuantity);
        field.onChange(validValue);
      }
    } else {
      // For decreasing or setting to the same value, use the original logic
      const validValue = Math.max(1, newValue);
      field.onChange(validValue);
    }
  };

  const handleRemove = () => {
    onRemove();
  };

  return (
    <div className="flex flex-col gap-2 rounded-md border !border-b border-muted bg-transparent p-3 first:mt-6">
      <div className="flex h-9 items-center justify-center gap-2 text-sm text-muted-foreground shadow-sm">
        <span>
          {currentPricingOption
            ? `${formatDuration(currentPricingOption.duration)} - ${formatPrice(currentPricingOption.value)}`
            : "Select pricing"}{" "}
          keys left:
        </span>
        <span className="text-foreground">
          {Math.max(0, remainingStock[currentPricingUuid] ?? 0)}
        </span>
      </div>

      <div className="grid w-full gap-4 md:grid-cols-11">
        {/* Pricing Select */}
        <Controller
          name={`products.${productIndex}.keys.${index}.pricingUuid`}
          control={control}
          render={({ field }) => (
            <div className="col-span-full flex flex-col md:col-span-3">
              <Select
                value={field.value}
                onValueChange={(newPricingUuid) => {
                  setValue(
                    `products.${productIndex}.keys.${index}.pricingUuid`,
                    newPricingUuid,
                  );
                  // Reset quantity to 1 when changing pricing
                  setValue(
                    `products.${productIndex}.keys.${index}.quantity`,
                    1,
                  );
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Pricing">
                    {currentPricingOption
                      ? `${formatDuration(currentPricingOption.duration)} - ${formatPrice(currentPricingOption.value)}`
                      : "Select Pricing"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {product.pricings
                    .filter((price) => remainingStock[price.uuid] ?? 0 > 0)
                    .map((price) => (
                      <SelectItem key={price.uuid} value={price.uuid}>
                        {`${formatDuration(price.duration)} - ${formatPrice(price.value)}`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.products?.[productIndex]?.keys?.[index]?.pricingUuid && (
                <span className="text-sm text-destructive">
                  {
                    errors.products[productIndex].keys[index].pricingUuid
                      ?.message
                  }
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
