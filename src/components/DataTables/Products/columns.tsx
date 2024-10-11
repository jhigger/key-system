import { type ColumnDef } from "@tanstack/react-table";
import { Menu, Trash } from "lucide-react";
import DebouncedInput from "~/components/DebouncedInput";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { filterFn, formatISOStringToDate, formatPrice } from "~/lib/utils";
import { useUIStore } from "~/state/ui.store";
import { variants, type PricingType } from "~/types/pricing";
import { type ProductType } from "~/types/product";
import { DataTableColumnHeader } from "../../DataTableColumnHeader";

interface PricingCellProps {
  pricing: PricingType;
  onEdit: (value: string) => void;
}

const PricingCell: React.FC<PricingCellProps> = ({ pricing, onEdit }) => {
  const { editMode } = useUIStore();
  const price = formatPrice(Number(pricing.value));

  if (editMode) {
    return (
      <DebouncedInput
        type="number"
        min="0"
        step="0.01"
        value={pricing.value}
        onChange={(value) => {
          const numValue = Math.max(0, Number(value));
          onEdit(numValue.toString());
        }}
        className="w-20"
      />
    );
  }

  return price;
};

const StockCell: React.FC<{
  value: number;
  onEdit: (value: number) => void;
}> = ({ value, onEdit }) => {
  const { editMode } = useUIStore();

  if (editMode) {
    return (
      <DebouncedInput
        type="number"
        min="0"
        step="1"
        value={value}
        onChange={(value) => {
          const newValue = Math.max(0, Math.floor(Number(value)));
          onEdit(newValue);
        }}
        className="w-20"
      />
    );
  }

  return <span className="font-medium">{value}</span>;
};

const ProductCell: React.FC<{
  value: string;
  onEdit: (value: string) => void;
}> = ({ value, onEdit }) => {
  const { editMode } = useUIStore();

  if (editMode) {
    return (
      <DebouncedInput
        type="text"
        value={value}
        onChange={(value) => onEdit(value)}
        className="w-full max-w-[200px]"
      />
    );
  }

  return <span className="font-medium">{value}</span>;
};

type TableProps = {
  onEdit: (product: Partial<ProductType>) => void;
  onDelete: (uuid: string) => void;
};

export const getColumns = ({
  onEdit,
  onDelete,
}: TableProps): ColumnDef<Partial<ProductType>>[] => [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Created" />
    ),
    cell: ({ row }) => {
      const { createdAt: purchasedAt } = row.original;

      if (!purchasedAt) return null;

      return formatISOStringToDate(purchasedAt);
    },
    filterFn: filterFn,
  },
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      const product: string = row.getValue("product");
      return (
        <ProductCell
          value={product}
          onEdit={(value) => onEdit({ ...row.original, product: value })}
        />
      );
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  ...variants.map<ColumnDef<Partial<ProductType>>>((name) => {
    return {
      accessorKey: name,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={name} />
      ),
      cell: ({ row }) => {
        const pricing = row.original.pricing;
        if (!pricing) return null;

        const variantPricing = pricing.find((p) => p.name.startsWith(name));
        if (!variantPricing) return null;

        return (
          <PricingCell
            pricing={variantPricing}
            onEdit={(value) => {
              const updatedPricing = pricing.map((p) =>
                p.name.startsWith(name) ? { ...p, value } : p,
              );
              onEdit({ ...row.original, pricing: updatedPricing });
            }}
          />
        );
      },
      enableSorting: false,
    };
  }),
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      const stock: number = row.getValue("stock");
      return (
        <StockCell
          value={stock}
          onEdit={(value) => onEdit({ ...row.original, stock: value })}
        />
      );
    },
  },
  {
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => {
      const { uuid } = row.original;

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
                onClick={() => onDelete(uuid)}
              >
                Delete <Trash size={16} />
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
