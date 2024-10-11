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
import { variants } from "~/types/pricing";
import { type ProductType } from "~/types/product";
import { Input } from "./ui/input";

const formSchema = z.object({
  product: z.string().min(1, "Product name is required"),
  pricing: z
    .array(
      z.object({
        name: z.enum(variants),
        value: z.coerce.string().min(1, "Pricing must be greater than zero"),
      }),
    )
    .optional(),
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
      stock: 0,
      pricing: [
        { name: "1 Day", value: "1" },
        { name: "3 Days", value: "1" },
        { name: "7 Days", value: "1" },
        { name: "30 Days", value: "1" },
        { name: "Lifetime", value: "1" },
      ],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleSubmit({
      ...values,
      uuid: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      value: values.product.toLowerCase().replace(" ", "-"),
      pricing: values.pricing ?? [],
    });
    toast.success("Product has been added successfully.");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 p-4 pb-0"
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
              name="pricing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{variant}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      value={
                        field.value?.find((item) => item.name === variant)
                          ?.value ?? ""
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        const currentPricing = field.value ?? [];
                        const updatedPricing = currentPricing.filter(
                          (item) => item.name !== variant,
                        );
                        if (value) {
                          updatedPricing.push({
                            name: variant,
                            value,
                          });
                        }
                        field.onChange(updatedPricing);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
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
