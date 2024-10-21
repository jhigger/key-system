import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
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
import useCategories from "~/hooks/useCategories";
import { type CategoryType } from "~/types/category";
import Loader from "./loader";
import { Input } from "./ui/input";

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

export interface CategoryFormRef {
  focus: () => void;
}

interface CategoryFormProps {
  handleSubmit: (values: CategoryType) => void;
  initialValues?: CategoryType;
}

const CategoryForm = forwardRef<CategoryFormRef, CategoryFormProps>(
  ({ handleSubmit, initialValues }, ref) => {
    const firstInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        firstInputRef.current?.focus();
      },
    }));

    const {
      query: { data: categories },
    } = useCategories();

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: initialValues?.name ?? "",
      },
    });

    const validateCategoryName = useCallback(
      async (name: string) => {
        if (name === initialValues?.name) return true;
        const exists = categories?.some((category) => category.name === name);
        return exists ? "Category name already exists" : true;
      },
      [categories, initialValues?.name],
    );

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      const nameValidationResult = await validateCategoryName(values.name);
      if (nameValidationResult !== true) {
        form.setError("name", { message: nameValidationResult });
        return;
      }

      const category: CategoryType = {
        uuid: initialValues?.uuid ?? uuidv4(),
        createdAt: initialValues?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: values.name,
      };

      handleSubmit(category);
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
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    ref={firstInputRef}
                    onChange={async (e) => {
                      field.onChange(e);
                      const result = await validateCategoryName(e.target.value);
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

CategoryForm.displayName = "CategoryForm";

export default CategoryForm;
