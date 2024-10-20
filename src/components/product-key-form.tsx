import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { forwardRef, useImperativeHandle, useRef, useCallback } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import useProductKeys from "~/hooks/useProductKeys";
import useProducts from "~/hooks/useProducts";
import { formatDuration } from "~/lib/utils";
import { type ProductKeyType } from "~/types/productKey";
import Loader from "./loader";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const formSchema = z.object({
  product: z.string().min(1, "Product is required"),
  pricingUuid: z.string().min(1, "Pricing is required"),
  keys: z
    .array(
      z.object({
        key: z.string().min(1, "Key is required"),
      }),
    )
    .min(1, "At least one key is required"),
});

export interface ProductKeyFormRef {
  focus: () => void;
}

type ProductKeyFormProps = {
  handleSubmit: (values: ProductKeyType[]) => void;
  setShowForm: (showForm: boolean) => void;
};

const ProductKeyForm = forwardRef<ProductKeyFormRef, ProductKeyFormProps>(
  ({ handleSubmit, setShowForm }, ref) => {
    const firstInputRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        firstInputRef.current?.focus();
      },
    }));

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        product: "",
        pricingUuid: "",
        keys: [{ key: "" }],
      },
    });

    const {
      query: { data: products, isLoading: productsLoading },
    } = useProducts();

    const {
      query: { data: productKeys },
    } = useProductKeys();

    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "keys",
    });

    const validateProductKey = useCallback(
      async (key: string, index: number) => {
        // Check if the key already exists in the form
        const existingKeys = form.getValues("keys").map((k) => k.key.trim());
        if (
          existingKeys.filter((k, i) => i !== index && k === key).length > 0
        ) {
          return "This key already exists in the form";
        }

        // Check if the key already exists in the database
        const existingDbKeys = productKeys?.map((k) => k.key) ?? [];
        if (existingDbKeys.includes(key)) {
          return "This key already exists in the database";
        }

        return true;
      },
      [form, productKeys],
    );

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      // Validate all keys before submission
      const keyValidationPromises = values.keys.map((keyObj, index) =>
        validateProductKey(keyObj.key, index),
      );
      const keyValidationResults = await Promise.all(keyValidationPromises);

      const hasInvalidKeys = keyValidationResults.some(
        (result) => result !== true,
      );
      if (hasInvalidKeys) {
        keyValidationResults.forEach((result, index) => {
          if (result !== true) {
            form.setError(`keys.${index}.key`, {
              type: "manual",
              message: result,
            });
          }
        });
        return;
      }

      const product = products?.find((p) => p.name === values.product);

      if (product === undefined) return;

      const productKeys: ProductKeyType[] = values.keys.map((keyObj) => ({
        uuid: uuidv4(),
        productId: product.uuid,
        key: keyObj.key,
        pricingId: values.pricingUuid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hardwareId: null,
        owner: null,
      }));

      handleSubmit(productKeys);
    };

    const handlePaste = (
      e: React.ClipboardEvent<HTMLInputElement>,
      index: number,
    ) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData("text");
      const keys = pastedText.split("\n").filter((key) => key.trim() !== "");

      // Get all existing keys from the form
      const existingKeys = new Set(
        form.getValues("keys").map((k) => k.key.trim()),
      );

      // Get all existing keys from the database
      const existingDbKeys = new Set(productKeys?.map((k) => k.key) ?? []);

      // Remove the current field if it's empty
      if (fields[index]?.key === "") {
        remove(index);
      }

      // Add all pasted keys
      keys.forEach((key, i) => {
        const trimmedKey = key.trim();
        if (i === 0 && fields[index]) {
          // Update the current field with the first key
          form.setValue(`keys.${index}.key`, trimmedKey);
          validateKey(index, trimmedKey, existingKeys, existingDbKeys);
        } else {
          // Append new fields for the rest of the keys
          append({ key: trimmedKey });
          validateKey(
            form.getValues("keys").length - 1,
            trimmedKey,
            existingKeys,
            existingDbKeys,
          );
        }
      });
    };

    const validateKey = (
      index: number,
      key: string,
      existingKeys: Set<string>,
      existingDbKeys: Set<string>,
    ) => {
      if (key.trim() === "") {
        form.setError(`keys.${index}.key`, {
          type: "manual",
          message: "Key is required",
        });
      } else if (existingKeys.has(key) || existingDbKeys.has(key)) {
        form.setError(`keys.${index}.key`, {
          type: "manual",
          message: "This key already exists",
        });
      } else {
        form.clearErrors(`keys.${index}.key`);
      }
    };

    if (productsLoading) {
      return <Loader />;
    }

    if (products?.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          <p>Please create a product first</p>
          <Button
            variant="link"
            className="underline"
            onClick={() => {
              setShowForm(false);
            }}
            asChild
          >
            <Link href="/admin#products?openForm=true">
              Click here to create a product
            </Link>
          </Button>
        </div>
      );
    }

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 p-4 pb-0"
          noValidate
        >
          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger ref={firstInputRef}>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products?.map((product) => (
                        <SelectItem key={product.uuid} value={product.name}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pricingUuid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pricing</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a pricing" />
                    </SelectTrigger>
                    <SelectContent>
                      {products
                        ?.find((p) => p.name === form.getValues("product"))
                        ?.pricings?.map((pricing) => (
                          <SelectItem key={pricing.uuid} value={pricing.uuid}>
                            {formatDuration(pricing.duration)}
                          </SelectItem>
                        )) ?? []}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`keys.${index}.key`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{`Product Key ${index + 1}`}</FormLabel>
                      <FormControl>
                        <div className="flex w-full space-x-2">
                          <div className="flex-grow">
                            <Input
                              {...field}
                              className="w-full"
                              onPaste={(e) => handlePaste(e, index)}
                              onChange={async (e) => {
                                field.onChange(e);
                                const currentKey = e.target.value;
                                const validationResult =
                                  await validateProductKey(currentKey, index);
                                if (validationResult !== true) {
                                  form.setError(`keys.${index}.key`, {
                                    type: "manual",
                                    message: validationResult,
                                  });
                                } else {
                                  form.clearErrors(`keys.${index}.key`);
                                }
                              }}
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => remove(index)}
                            className="hover:bg-destructive/80"
                            disabled={fields.length === 1}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => append({ key: "" })}
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another Key
              </Button>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Loader /> : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    );
  },
);

ProductKeyForm.displayName = "ProductKeyForm";

export default ProductKeyForm;
