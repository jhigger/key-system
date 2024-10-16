import { type ColumnDef, type Row } from "@tanstack/react-table";
import { Copy, Menu, Trash } from "lucide-react";
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
  sortByProduct,
  sortByVariant,
} from "~/lib/utils";
import { useUIStore } from "~/state/ui.store";
import { type ProductType } from "~/types/product";
import { type ProductKeyType } from "~/types/productKey";
import { DataTableColumnHeader } from "../../data-table-column-header";

const ProductCell: React.FC<{
  row: Row<ProductKeyType>;
}> = ({ row }) => {
  const { editMode } = useUIStore();
  const {
    mutation: { editProductKey },
  } = useProductKeys();
  const {
    query: { data: products, isLoading },
  } = useProducts();

  if (isLoading) return <div>Loading...</div>;
  if (!products) return null;

  const currentProduct = products.find(
    (p) => p.uuid === row.original.productId,
  );
  const currentProductName = currentProduct ? currentProduct.name : "";

  if (editMode) {
    return (
      <Select
        value={row.original.productId}
        onValueChange={(newProductUuid) => {
          const newProduct = products.find((p) => p.uuid === newProductUuid);
          if (!newProduct) return;

          // Reset pricingUuid to the first available pricing of the new product
          const newPricingUuid = newProduct.pricing[0]?.uuid ?? "";

          editProductKey({
            ...row.original,
            productId: newProductUuid,
            pricingId: newPricingUuid,
          });
        }}
      >
        <SelectTrigger className="w-[180px] capitalize">
          <SelectValue placeholder="Select a product">
            {currentProductName}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {products.map((product) => (
            <SelectItem
              key={product.uuid}
              value={product.uuid}
              className="capitalize"
            >
              {product.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return currentProductName;
};

const DurationCell: React.FC<{
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

  const product = products.find((p) => p.uuid === row.original.productId);
  if (!product) return null;

  const currentPricing = product.pricing.find(
    (p) => p.uuid === row.original.pricingId,
  );

  if (editMode) {
    return (
      <Select
        value={row.original.pricingId}
        onValueChange={(newPricingUuid) => {
          editProductKey({
            ...row.original,
            pricingId: newPricingUuid,
          });
        }}
      >
        <SelectTrigger className="w-[180px] capitalize">
          <SelectValue placeholder="Select a duration">
            {currentPricing ? formatDuration(currentPricing.duration) : "N/A"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {product.pricing
            .slice() // Create a shallow copy to avoid mutating the original array
            .sort((a, b) => {
              // Place zero duration at the bottom
              if (a.duration === 0) return 1;
              if (b.duration === 0) return -1;
              // Sort other durations in ascending order
              return a.duration - b.duration;
            })
            .map((pricing) => (
              <SelectItem
                key={pricing.uuid}
                value={pricing.uuid}
                className="capitalize"
              >
                {formatDuration(pricing.duration)}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Badge className="capitalize">
      {currentPricing ? formatDuration(currentPricing.duration) : "N/A"}
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

const PricingCell: React.FC<{
  row: Row<ProductKeyType>;
}> = ({ row }) => {
  const { productId: uuid, pricingId: pricingUuid } = row.original;
  const {
    query: { data: products },
  } = useProducts();

  if (!products) return null;

  const product = products.find((p) => p.uuid === uuid);

  if (!product) return null;

  const pricing = product.pricing.find((p) => p.uuid === pricingUuid);

  return formatPrice(pricing?.value ?? 0);
};

export const getColumns = ({
  products,
}: {
  products?: ProductType[];
}): ColumnDef<ProductKeyType>[] => [
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
      return value.includes(row.original.productId);
    },
    sortingFn: (rowA, rowB) => sortByProduct(rowA, rowB, products ?? []),
    accessorFn: (row) => row.productId,
  },
  {
    accessorKey: "pricingUuid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ row }) => <DurationCell row={row} />,
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.original.pricingId);
    },
    sortingFn: (rowA, rowB) => sortByVariant(rowA, rowB, products ?? []),
    accessorFn: (row) => row.pricingId,
  },
  {
    id: "price",
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => <PricingCell row={row} />,
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.original.pricingId);
    },
    accessorFn: (row) => row.pricingId,
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
