import { type ColumnDef } from "@tanstack/react-table";
import { Menu, Trash } from "lucide-react";
import DebouncedInput from "~/components/DebouncedInput";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
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
import { fakeProducts } from "~/lib/fakeData";
import { filterFn, formatISOStringToDate } from "~/lib/utils";
import { useUIStore } from "~/state/ui.store";
import { variants, type PricingType } from "~/types/pricing";
import { type ProductKeyType } from "~/types/productKey";
import { DataTableColumnHeader } from "../../DataTableColumnHeader";

const ProductCell: React.FC<{
  value: string;
  onEdit: (value: string) => void;
}> = ({ value, onEdit }) => {
  const { editMode } = useUIStore();

  if (editMode) {
    return (
      <Select defaultValue={value} onValueChange={onEdit}>
        <SelectTrigger className="w-[180px] capitalize">
          <SelectValue placeholder="Select a variant" />
        </SelectTrigger>
        <SelectContent>
          {fakeProducts.map((product) => (
            <SelectItem
              key={product.uuid}
              value={product.name}
              className="capitalize"
            >
              {product.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return value;
};

const VariantCell: React.FC<{
  value: PricingType["name"];
  onEdit: (value: PricingType["name"]) => void;
}> = ({ value, onEdit }) => {
  const { editMode } = useUIStore();

  if (editMode) {
    return (
      <Select defaultValue={value} onValueChange={onEdit}>
        <SelectTrigger className="w-[180px] capitalize">
          <SelectValue placeholder="Select a variant" />
        </SelectTrigger>
        <SelectContent>
          {variants.map((option) => (
            <SelectItem key={option} value={option} className="capitalize">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return <Badge className="capitalize">{value}</Badge>;
};

const KeyCell: React.FC<{
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

  return value;
};

type TableProps = {
  onEdit: (productKey: Partial<ProductKeyType>) => void;
  onDelete: (uuid: string) => void;
};

export const getColumns = ({
  onEdit,
  onDelete,
}: TableProps): ColumnDef<Partial<ProductKeyType>>[] => [
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
        <div className="flex flex-col gap-1">
          <span>{formattedDate}</span>
          <span>{formattedTime}</span>
        </div>
      );
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
  {
    accessorKey: "variant",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Variant" />
    ),
    cell: ({ row }) => {
      const variant: PricingType["name"] = row.getValue("variant");
      return (
        <VariantCell
          value={variant}
          onEdit={(value) => onEdit({ ...row.original, variant: value })}
        />
      );
    },
  },
  {
    accessorKey: "key",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Key" />
    ),
    cell: ({ row }) => {
      const key: string = row.getValue("key");
      return (
        <KeyCell
          value={key}
          onEdit={(value) => onEdit({ ...row.original, key: value })}
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
