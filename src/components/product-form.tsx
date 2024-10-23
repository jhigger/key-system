import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2 } from "lucide-react";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
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
import useCategories from "~/hooks/useCategories";
import useProducts from "~/hooks/useProducts";
import { cn } from "~/lib/utils";
import { type ProductType } from "~/types/product";
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
  category: z.string().nullable(),
  name: z.string().min(1, "Product name is required"),
  pricing: z
    .array(
      z.object({
        uuid: z.string().optional(),
        duration: z.number().min(0, "Duration must be a non-negative number"),
        value: z.number().min(0.01, "Price must be greater than 0"),
        stock: z.number().min(0, "Stock cannot be negative"),
      }),
    )
    .refine(
      (pricing) =>
        pricing.length === 0 ||
        pricing.some((p) => p.duration >= 0 && p.value > 0),
      {
        message: "At least one valid pricing entry is required",
      },
    )
    .refine(
      (pricing) => {
        const durations = pricing.map((p) => p.duration);
        return new Set(durations).size === durations.length;
      },
      {
        message: "Duration must be unique across all pricing variants",
      },
    ),
});

export interface ProductFormRef {
  focus: () => void;
}

interface ProductFormProps {
  handleSubmit: (values: ProductType) => void;
  initialValues?: ProductType;
}

const ProductForm = forwardRef<ProductFormRef, ProductFormProps>(
  ({ handleSubmit, initialValues }, ref) => {
    const firstInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        firstInputRef.current?.focus();
      },
    }));

    const {
      query: { data: products },
      mutation: { deletePricing },
    } = useProducts();

    const {
      query: { data: categories },
    } = useCategories();

    const validateProductName = useCallback(
      async (name: string) => {
        if (name === initialValues?.name) return true;
        const exists = products?.some((product) => product.name === name);
        return exists ? "Product name already exists" : true;
      },
      [products, initialValues?.name],
    );

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: initialValues?.name ?? "",
        pricing: initialValues?.pricings ?? [
          {
            duration: 0,
            value: 1,
            stock: 0,
          },
        ],
        category: initialValues?.category ?? "null",
      },
    });

    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "pricing",
    });

    const addPricingVariant = async () => {
      append({ duration: 0, value: 1, stock: 0 });
      // Trigger validation after adding a new variant
      await form.trigger("pricing");
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      const nameValidationResult = await validateProductName(values.name);
      if (nameValidationResult !== true) {
        form.setError("name", { message: nameValidationResult });
        return;
      }

      const product: ProductType = {
        uuid: initialValues?.uuid ?? uuidv4(),
        createdAt: initialValues?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: values.category === "null" ? null : (values.category ?? null),
        name: values.name,
        pricings: values.pricing.map((p) => ({
          ...p,
          uuid:
            initialValues?.pricings.find((op) => op.uuid === p.uuid)?.uuid ??
            uuidv4(),
        })),
      };

      handleSubmit(product);
    };

    const isEditing = !!initialValues?.name;

    const removePricingVariant = async (index: number) => {
      if (initialValues) {
        const pricingToDelete = initialValues.pricings[index];
        if (pricingToDelete) {
          deletePricing({
            productUuid: initialValues.uuid,
            pricingUuid: pricingToDelete.uuid,
          });
        }
      }
      remove(index);
    };

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 p-4 pb-0"
          noValidate
        >
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">None</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category.uuid} value={category.uuid}>
                          {category.name}
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    ref={firstInputRef}
                    disabled={isEditing}
                    onChange={async (e) => {
                      field.onChange(e);
                      const result = await validateProductName(e.target.value);
                      if (result !== true) {
                        form.setError("name", {
                          type: "manual",
                          message: result,
                        });
                      } else {
                        form.clearErrors("name");
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <FormLabel>Pricing Variants (zero duration for infinite)</FormLabel>
            <div className="grid grid-cols-11 items-end gap-4">
              {fields.map((field, index) => (
                <React.Fragment key={field.id}>
                  <FormField
                    control={form.control}
                    name={`pricing.${index}.duration`}
                    render={({ field }) => (
                      <FormItem className="col-span-5">
                        <FormLabel>Duration (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step={1}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`pricing.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="col-span-5">
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={async () => {
                      await removePricingVariant(index);
                      await form.trigger("pricing");
                    }}
                    className={cn(
                      "col-span-1 flex-shrink-0 hover:bg-destructive/80",
                      form.getFieldState(`pricing.${index}`).error &&
                        "mb-[2px]",
                    )}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </React.Fragment>
              ))}
              {form.formState.errors.pricing?.root && (
                <p className="col-span-full text-sm text-destructive">
                  {form.formState.errors.pricing.root.message}
                </p>
              )}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => void addPricingVariant()}
                className="col-span-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Pricing Variant
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

ProductForm.displayName = "ProductForm";

export default ProductForm;
