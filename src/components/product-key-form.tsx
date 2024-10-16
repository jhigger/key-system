import { zodResolver } from "@hookform/resolvers/zod";
import { Dices } from "lucide-react";
import Link from "next/link";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useForm } from "react-hook-form";
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
  key: z.string().min(1, "Key is required"),
});

export interface ProductKeyFormRef {
  focus: () => void;
}

type ProductKeyFormProps = {
  handleSubmit: (values: ProductKeyType) => void;
};

const ProductKeyForm = forwardRef<ProductKeyFormRef, ProductKeyFormProps>(
  ({ handleSubmit }, ref) => {
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
        key: "",
      },
    });

    const {
      query: { data: products, isLoading },
    } = useProducts();

    const onSubmit = (values: z.infer<typeof formSchema>) => {
      const product = products?.find((p) => p.name === values.product);

      if (product === undefined) return;

      const productKey: ProductKeyType = {
        ...values,
        uuid: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        productId: product.uuid,
        pricingId:
          product.pricing.find((p) => p.uuid === values.pricingUuid)?.uuid ??
          "",
        hardwareId: null,
        owner: null,
      };
      handleSubmit(productKey);
    };

    const generateKey = () => {
      return uuidv4();
    };

    if (isLoading) {
      return <Loader />;
    }

    if (products?.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          <p>Please create a product first</p>
          <Button variant="link" className="underline" asChild>
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
                        ?.pricing?.map((pricing) => (
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
          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Product Key</FormLabel>
                <FormControl>
                  <div className="flex w-full space-x-2">
                    <div className="flex-grow">
                      <Input {...field} className="w-full" />
                    </div>
                    <Button
                      variant="outline"
                      type="button"
                      className="gap-2 leading-normal"
                      onClick={() => {
                        field.onChange(generateKey());
                      }}
                    >
                      <Dices size={20} /> Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? <Loader /> : "Submit"}
          </Button>
        </form>
      </Form>
    );
  },
);

ProductKeyForm.displayName = "ProductKeyForm";

export default ProductKeyForm;
