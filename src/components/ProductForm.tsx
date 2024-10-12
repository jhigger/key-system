import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { type PricingType, variants } from "~/types/pricing";
import { type ProductType } from "~/types/product";
import { Input } from "./ui/input";

const pricingSchema = z
  .string()
  .refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    "Pricing must be a number greater than zero",
  );

const formSchema = z.object({
  product: z.string().min(1, "Product name is required"),
  pricing: z.object(
    Object.fromEntries(variants.map((variant) => [variant, pricingSchema])),
  ),
  stock: z.number().min(0, "Stock must be a non-negative number"),
});

type ProductFormProps = {
  handleSubmit: (values: ProductType) => void;
};

const ProductForm = ({ handleSubmit }: ProductFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: "",
      pricing: Object.fromEntries(variants.map((variant) => [variant, ""])),
      stock: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formattedPricing = Object.entries(values.pricing).map(
      ([name, value]) => ({
        name: name as PricingType["name"],
        value,
      }),
    );

    handleSubmit({
      ...values,
      uuid: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      value: values.product.toLowerCase().replace(" ", "-"),
      pricing: formattedPricing,
    });
    toast.success("Product has been added successfully.");
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
            <FormItem className="col-span-full">
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>Pricing Variants</FormLabel>
          {variants.map((variant) => (
            <FormField
              key={variant}
              control={form.control}
              name={`pricing.${variant}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{variant}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          {form.formState.errors.pricing?.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.pricing.root.message}
            </p>
          )}
        </div>
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(+e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
