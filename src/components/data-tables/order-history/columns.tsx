import { type ColumnDef, type Row } from "@tanstack/react-table";
import useProducts from "~/hooks/useProducts";
import {
  dateFilterFn,
  formatDuration,
  formatISOStringToDate,
  sortByVariant,
} from "~/lib/utils";
import { type OrderType } from "~/types/order";
import { type ProductType } from "~/types/product";
import { DataTableColumnHeader } from "../../data-table-column-header";

const ProductCell: React.FC<{
  row: Row<OrderType>;
}> = ({ row }) => {
  const { productKeySnapshot } = row.original;
  return productKeySnapshot.productName;
};

const VariantCell: React.FC<{
  row: Row<OrderType>;
}> = ({ row }) => {
  const { productKeySnapshot: productKey } = row.original;
  const {
    query: { data: products },
  } = useProducts();

  if (!products) return null;

  const duration = productKey.pricing.duration;
  return formatDuration(duration);
};

export const getColumns = ({
  products,
}: {
  products?: ProductType[];
}): ColumnDef<OrderType>[] => [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Purchased" />
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
      return value.includes(row.original.productKeySnapshot.productName);
    },
    accessorFn: (row) => row.productKeySnapshot.productName,
  },
  {
    accessorKey: "invoiceLink",
    header: "Invoice Link",
    enableSorting: false,
  },
  {
    id: "variant",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Variant" />
    ),
    cell: ({ row }) => <VariantCell row={row} />,
    filterFn: (row, id, value: OrderType["productKeySnapshot"]) => {
      const duration = row.original.productKeySnapshot.pricing.duration;
      return value.pricing.duration === duration;
    },
    sortingFn: (rowA, rowB) => sortByVariant(rowA, rowB, products ?? []),
    accessorFn: (row) => {
      const duration = row.productKeySnapshot.pricing.duration;
      return duration;
    },
  },
];
