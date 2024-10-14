import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2 } from "lucide-react";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
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
import { cn } from "~/lib/utils";
import { type ProductType } from "~/types/product";
import Loader from "./loader";
import { Input } from "./ui/input";

const pricingSchema = z.object({
  duration: z.number().min(0, "Duration must be a non-negative number"),
  value: z
    .number()
    .refine(
      (val) => !isNaN(val) && val > 0,
      "Pricing must be a number greater than zero",
    ),
  stock: z.number().min(0, "Stock must be a non-negative number"),
});

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  pricing: z.array(pricingSchema).refine(
    (pricing) => {
      const durations = pricing.map((p) => p.duration);
      return new Set(durations).size === durations.length;
    },
    { message: "Durations must be unique across all pricing variants" },
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

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: initialValues?.name ?? "",
        pricing: initialValues?.pricing ?? [
          {
            duration: 0,
            value: 1,
            stock: 0,
          },
        ],
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

    const onSubmit = (values: z.infer<typeof formSchema>) => {
      const product: ProductType = {
        uuid: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: values.name,
        pricing: values.pricing.map((p) => ({
          ...p,
          uuid: uuidv4(),
        })),
      };
      handleSubmit(product);
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    ref={firstInputRef}
                    disabled={!!initialValues?.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <FormLabel>Pricing Variants (zero duration for infinite)</FormLabel>
            <div className="grid grid-cols-10 items-end gap-4">
              {fields.map((field, index) => (
                <React.Fragment key={field.id}>
                  <FormField
                    control={form.control}
                    name={`pricing.${index}.duration`}
                    render={({ field }) => (
                      <FormItem className="col-span-3">
                        <FormLabel>Duration</FormLabel>
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
                      <FormItem className="col-span-3">
                        <FormLabel>Price</FormLabel>
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
                  <FormField
                    control={form.control}
                    name={`pricing.${index}.stock`}
                    render={({ field }) => (
                      <FormItem className="col-span-3">
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
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
                    onClick={() => remove(index)}
                    className={cn(
                      "col-span-1 flex-shrink-0 hover:bg-destructive/80",
                      form.getFieldState(`pricing.${index}`).error &&
                        "mb-[2px]",
                    )}
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
              {form.formState.isSubmitting && <Loader />}
              Submit
            </Button>
          </div>
        </form>
      </Form>
    );
  },
);

ProductForm.displayName = "ProductForm";

export default ProductForm;
