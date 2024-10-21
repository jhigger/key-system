import { type ColumnDef, type Row } from "@tanstack/react-table";
import { Menu, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DebouncedInput from "~/components/debounced-input";
import ProductForm, { type ProductFormRef } from "~/components/product-form";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import useCategories from "~/hooks/useCategories";
import useProducts from "~/hooks/useProducts";
import {
  dateFilterFn,
  formatDuration,
  formatISOStringToDate,
  formatPrice,
} from "~/lib/utils";
import { useUIStore } from "~/state/ui.store";
import { type ProductType } from "~/types/product";
import { DataTableColumnHeader } from "../../data-table-column-header";

const DurationCell: React.FC<{
  row: Row<ProductType>;
}> = ({ row }) => {
  const { editMode } = useUIStore();
  const {
    mutation: { editProduct },
  } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const productKeyFormRef = useRef<ProductFormRef>(null);
  const pricing = row.original.pricings;

  return (
    <>
      {pricing.map((p) => (
        <div
          key={p.uuid}
          className="-mr-4 -translate-x-4 border-b py-2 pl-4 last:border-b-0"
        >
          {editMode ? (
            <Drawer open={showForm} onOpenChange={setShowForm}>
              <DrawerTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="flex h-9 min-w-20 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                >
                  {formatDuration(p.duration)}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
                  <div className="mx-auto w-full max-w-screen-sm">
                    <DrawerHeader>
                      <DrawerTitle>Add a new pricing</DrawerTitle>
                      <DrawerDescription>
                        Click submit when you&apos;re done or cancel to discard
                        changes.
                      </DrawerDescription>
                    </DrawerHeader>
                    <ProductForm
                      ref={productKeyFormRef}
                      handleSubmit={(values) => {
                        console.log("row.original", row.original);
                        console.log("values", values);
                        editProduct({
                          ...row.original,
                          ...values,
                        });
                        setShowForm(false);
                      }}
                      initialValues={row.original}
                    />
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            formatDuration(p.duration)
          )}
        </div>
      ))}
    </>
  );
};

const PricingCell: React.FC<{
  row: Row<ProductType>;
}> = ({ row }) => {
  const { editMode } = useUIStore();
  const {
    mutation: { editPricing },
  } = useProducts();
  const { pricings } = row.original;

  return (
    <>
      {pricings.map((p) => (
        <div
          key={p.uuid}
          className="-mr-4 -translate-x-4 border-b py-2 pl-4 last:border-b-0"
        >
          {editMode ? (
            <DebouncedInput
              type="number"
              min="0"
              step="0.01"
              value={p.value.toString()}
              onChange={(value) => {
                const numValue = Math.max(0, Number(value));
                if (!isNaN(numValue) && numValue !== p.value) {
                  editPricing({
                    pricingUuid: p.uuid,
                    newPricing: {
                      ...p,
                      value: numValue,
                    },
                  });
                }
              }}
              className="w-20"
            />
          ) : (
            formatPrice(Number(p.value))
          )}
        </div>
      ))}
    </>
  );
};

const StockCell: React.FC<{
  row: Row<ProductType>;
}> = ({ row }) => {
  const pricing = row.original.pricings;

  return pricing.reduce((acc, curr) => acc + curr.stock, 0);
};

const ProductCell: React.FC<{
  row: Row<ProductType>;
}> = ({ row }) => {
  const { editMode } = useUIStore();
  const {
    mutation: { editProduct },
  } = useProducts();

  if (editMode) {
    return (
      <DebouncedInput
        type="text"
        value={row.original.name}
        onChange={(value) => editProduct({ ...row.original, name: value })}
        className="w-full max-w-[200px]"
      />
    );
  }

  return row.original.name;
};

const ActionsCell: React.FC<{
  row: Row<ProductType>;
}> = ({ row }) => {
  const { uuid } = row.original;
  const {
    mutation: { deleteProduct, deletePricing, editProduct },
  } = useProducts();
  const { editMode } = useUIStore();
  const [showForm, setShowForm] = useState(false);
  const productKeyFormRef = useRef<ProductFormRef>(null);

  useEffect(() => {
    if (showForm) {
      setTimeout(() => {
        productKeyFormRef.current?.focus();
      }, 100);
    }
  }, [showForm]);

  if (editMode) {
    return (
      <div className="-ml-4 flex flex-col whitespace-nowrap">
        {row.original.pricings.map((pricing) => (
          <div
            key={pricing.uuid}
            className="border-b py-2 pl-4 transition-colors last:border-b-0"
          >
            <Button
              variant="destructive"
              onClick={() =>
                deletePricing({
                  productUuid: row.original.uuid,
                  pricingUuid: pricing.uuid,
                })
              }
              className="gap-2"
            >
              Delete <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="gap-2">
          <Menu size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-1">
        <DropdownMenuItem
          onClick={() => setShowForm(true)}
          className="flex w-full justify-between gap-4 leading-normal"
          asChild
        >
          <Button variant={"ghost"} className="justify-between gap-2 px-2">
            Add/Edit <Pencil size={16} />
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex w-full justify-between gap-4 leading-normal"
          asChild
        >
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteProduct(uuid)}
          >
            Delete <Trash2 size={16} />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <Drawer open={showForm} onOpenChange={setShowForm}>
        <DrawerContent>
          <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
            <div className="mx-auto w-full max-w-screen-sm">
              <DrawerHeader>
                <DrawerTitle>Add a new pricing</DrawerTitle>
                <DrawerDescription>
                  Click submit when you&apos;re done or cancel to discard
                  changes.
                </DrawerDescription>
              </DrawerHeader>
              <ProductForm
                ref={productKeyFormRef}
                handleSubmit={(values) => {
                  editProduct({
                    ...row.original,
                    ...values,
                  });
                  setShowForm(false);
                }}
                initialValues={row.original}
              />
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </DropdownMenu>
  );
};

const CategoryCell: React.FC<{
  row: Row<ProductType>;
}> = ({ row }) => {
  const {
    query: { data: categories },
  } = useCategories();
  const category = categories?.find((c) => c.uuid === row.original.category);
  const { editMode } = useUIStore();
  const {
    mutation: { editProduct },
  } = useProducts();

  if (editMode) {
    return (
      <Select
        value={category?.uuid}
        onValueChange={(value) =>
          editProduct({
            ...row.original,
            category: value === "null" ? null : value,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="None" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="null">None</SelectItem>
          {categories?.map((c) => (
            <SelectItem key={c.uuid} value={c.uuid}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return category?.name ?? "None";
};

export const getColumns = (): ColumnDef<ProductType>[] => [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Created" />
    ),
    cell: ({ row }) => {
      const { createdAt } = row.original;

      if (!createdAt) return null;

      const { formattedDate, formattedTime } = formatISOStringToDate(createdAt);
      return (
        <div className="flex flex-col gap-1 font-mono">
          <span>{formattedDate}</span>
          <span>{formattedTime}</span>
        </div>
      );
    },
    filterFn: dateFilterFn,
  },
  {
    id: "dateGlobalFilter",
    header: () => null,
    cell: () => null,
    accessorFn: (row) =>
      formatISOStringToDate(row.createdAt).formattedDate +
      " " +
      formatISOStringToDate(row.createdAt).formattedTime,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => <CategoryCell row={row} />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <ProductCell row={row} />,
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    header: "Duration",
    cell: ({ row }) => <DurationCell row={row} />,
  },
  {
    header: "Pricing",
    cell: ({ row }) => <PricingCell row={row} />,
  },
  {
    header: "Stock",
    cell: ({ row }) => <StockCell row={row} />,
  },
  {
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
