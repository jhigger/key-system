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
import useProducts from "~/hooks/useProducts";
import {
  censorUUID,
  copyToClipboard,
  dateFilterFn,
  formatDuration,
  formatISOStringToDate,
  formatPrice,
  sortByVariant,
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
  const {
    query: { data: products },
  } = useProducts();

  if (!products) return null;

  if (editMode) {
    return (
      <Select
        value={currentProduct}
        onValueChange={(newProduct) => {
          const product = products?.find((p) => p.name === newProduct);
          if (!product) return;
          setCurrentProduct(newProduct);
          editProductKey({
            ...row.original,
            product,
          });
        }}
      >
        <SelectTrigger className="w-[180px] capitalize">
          <SelectValue placeholder="Select a product" />
        </SelectTrigger>
        <SelectContent>
          {products.map((product) => (
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
  const {
    query: { data: products },
  } = useProducts();

  if (!products) return null;

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
          {products
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
    id: "dateGlobalFilter",
    header: () => null,
    cell: () => null,
    accessorFn: (row) =>
      formatISOStringToDate(row.createdAt).formattedDate +
      " " +
      formatISOStringToDate(row.createdAt).formattedTime,
  },
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => <ProductCell row={row} />,
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.original.product.name);
    },
    sortingFn: (rowA, rowB) => {
      return rowA.original.product.name.localeCompare(
        rowB.original.product.name,
      );
    },
    accessorFn: (row) => row.product.name,
  },
  {
    accessorKey: "duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ row }) => <VariantCell row={row} />,
    filterFn: (row, id, value: number[]) => {
      return value.includes(row.original.duration);
    },
    sortingFn: sortByVariant,
    accessorFn: (row) => row.duration,
  },
  {
    id: "price",
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) =>
      formatPrice(
        row.original.product.pricing.find(
          (p) => p.duration === row.original.duration,
        )?.value ?? 0,
      ),
    filterFn: (row, id, value: number[]) => {
      return value.includes(
        row.original.product.pricing.find(
          (p) => p.duration === row.original.duration,
        )?.value ?? 0,
      );
    },
    accessorFn: (row) =>
      row.product.pricing.find((p) => p.duration === row.duration)?.value ?? 0,
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
