import { type ColumnDef, type Row } from "@tanstack/react-table";
import { Copy, Menu, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DebouncedInput from "~/components/debounced-input";
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
import useProductKeys from "~/hooks/useProductKeys";
import { fakeProducts } from "~/lib/fakeData";
import {
  censorUUID,
  copyToClipboard,
  dateFilterFn,
  formatDuration,
  formatISOStringToDate,
} from "~/lib/utils";
import { useUIStore } from "~/state/ui.store";
import { type ProductKeyType } from "~/types/productKey";
import { DataTableColumnHeader } from "../../data-table-column-header";

const ProductCell: React.FC<{
  row: Row<ProductKeyType>;
}> = ({ row }) => {
  const { editMode } = useUIStore();
  const [currentProduct, setCurrentProduct] = useState<string>(
    row.original.product.name,
  );
  const {
    mutation: { editProductKey },
  } = useProductKeys();

  if (editMode) {
    return (
      <Select
        value={currentProduct}
        onValueChange={(newProduct) => {
          setCurrentProduct(newProduct);
          editProductKey({
            ...row.original,
            product: fakeProducts.find((p) => p.name === newProduct)!,
          });
        }}
      >
        <SelectTrigger className="w-[180px] capitalize">
          <SelectValue placeholder="Select a product" />
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

  return currentProduct;
};

const VariantCell: React.FC<{
  row: Row<ProductKeyType>;
}> = ({ row }) => {
  const { editMode } = useUIStore();
  const {
    mutation: { editProductKey },
  } = useProductKeys();

  if (editMode) {
    return (
      <Select
        value={formatDuration(row.original.duration)}
        onValueChange={(newVariant: string) => {
          editProductKey({
            ...row.original,
            duration: parseInt(newVariant),
          });
        }}
      >
        <SelectTrigger className="w-[180px] capitalize">
          <SelectValue placeholder="Select a variant" />
        </SelectTrigger>
        <SelectContent>
          {fakeProducts
            .find((p) => p.name === row.original.product.name)
            ?.pricing.map((product) => (
              <SelectItem
                key={formatDuration(product.duration)}
                value={formatDuration(product.duration)}
                className="capitalize"
              >
                {formatDuration(product.duration)}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Badge className="capitalize">
      {formatDuration(row.original.duration)}
    </Badge>
  );
};

const KeyCell: React.FC<{
  row: Row<ProductKeyType>;
}> = ({ row }) => {
  const { editMode } = useUIStore();
  const {
    mutation: { editProductKey },
  } = useProductKeys();

  if (editMode) {
    return (
      <DebouncedInput
        type="text"
        value={row.original.key}
        onChange={(value) => editProductKey({ ...row.original, key: value })}
        className="w-full max-w-[200px]"
      />
    );
  }

  return (
    <Button
      variant={"ghost"}
      size={"sm"}
      className="-ml-3 min-w-full max-w-40 gap-2"
      onClick={() =>
        copyToClipboard(row.original.key)
          .then(() => toast.success("Key copied to clipboard"))
          .catch(() => toast.error("Failed to copy key"))
      }
      title={"Click to copy full key"}
    >
      <span className="truncate">{censorUUID(row.original.key)}</span>
      {row.original.key && (
        <Copy size={16} className="shrink-0 text-gray-500" />
      )}
    </Button>
  );
};

const ActionsCell: React.FC<{
  row: Row<ProductKeyType>;
}> = ({ row }) => {
  const {
    mutation: { deleteProductKey },
  } = useProductKeys();

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
            onClick={() => deleteProductKey(row.original.uuid)}
          >
            Delete <Trash size={16} />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const getColumns = (): ColumnDef<ProductKeyType>[] => [
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
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => <ProductCell row={row} />,
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "variant",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Variant" />
    ),
    cell: ({ row }) => <VariantCell row={row} />,
  },
  {
    accessorKey: "key",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Key" />
    ),
    cell: ({ row }) => <KeyCell row={row} />,
  },
  {
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
