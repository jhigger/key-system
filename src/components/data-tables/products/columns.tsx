import { type ColumnDef, type Row } from "@tanstack/react-table";
import { Menu, Trash } from "lucide-react";
import DebouncedInput from "~/components/debounced-input";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import useProducts from "~/hooks/useProducts";
import { dateFilterFn, formatISOStringToDate, formatPrice } from "~/lib/utils";
import { useUIStore } from "~/state/ui.store";
import { variants, type PricingType } from "~/types/pricing";
import { type ProductType } from "~/types/product";
import { DataTableColumnHeader } from "../../data-table-column-header";

const PricingCell: React.FC<{
  name: PricingType["name"];
  row: Row<ProductType>;
}> = ({ name, row }) => {
  const { editMode } = useUIStore();
  const {
    mutation: { editProduct },
  } = useProducts();

  const pricing = row.original.pricing;
  if (!pricing) return null;

  const variantPricing = pricing.find((p) => p.name.startsWith(name));
  if (!variantPricing) return null;

  const price = formatPrice(Number(variantPricing?.value));

  if (editMode) {
    return (
      <DebouncedInput
        type="number"
        min="0"
        step="0.01"
        value={variantPricing?.value}
        onChange={(value) => {
          const numValue = Math.max(0, Number(value));
          editProduct({
            ...row.original,
            pricing: pricing.map((p) =>
              p.name.startsWith(name)
                ? { ...p, value: numValue.toString() }
                : p,
            ),
          });
        }}
        className="w-20"
      />
    );
  }

  return price;
};

const StockCell: React.FC<{
  row: Row<ProductType>;
}> = ({ row }) => {
  const { editMode } = useUIStore();
  const {
    mutation: { editProduct },
  } = useProducts();

  if (editMode) {
    return (
      <DebouncedInput
        type="number"
        min="0"
        step="1"
        value={row.original.stock}
        onChange={(value) => {
          const newValue = Math.max(0, Math.floor(Number(value)));
          editProduct({ ...row.original, stock: newValue });
        }}
        className="w-20"
      />
    );
  }

  return row.original.stock;
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
    mutation: { deleteProduct },
  } = useProducts();

  if (!uuid) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="gap-2">
          <Menu size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="flex w-full justify-between gap-4 leading-normal"
          asChild
        >
          <Button
            variant={"destructive"}
            size={"sm"}
            onClick={() => deleteProduct(uuid)}
          >
            Delete <Trash size={16} />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const getColumns = (): ColumnDef<ProductType>[] => [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Created" />
    ),
    cell: ({ row }) => {
      const { createdAt: purchasedAt } = row.original;

      if (!purchasedAt) return null;

      const { formattedDate, formattedTime } =
        formatISOStringToDate(purchasedAt);
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <ProductCell row={row} />,
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  ...variants.map<ColumnDef<ProductType>>((name) => {
    return {
      accessorKey: name,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={name} />
      ),
      cell: ({ row }) => <PricingCell name={name} row={row} />,
      enableSorting: false,
    };
  }),
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => <StockCell row={row} />,
  },
  {
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
