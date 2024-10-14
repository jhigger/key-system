import { type ColumnDef, type Row } from "@tanstack/react-table";
import useProducts from "~/hooks/useProducts";
import {
  dateFilterFn,
  formatDuration,
  formatISOStringToDate,
  sortByVariant,
} from "~/lib/utils";
import { type OrderType } from "~/types/order";
import { DataTableColumnHeader } from "../../data-table-column-header";

const ProductCell: React.FC<{
  row: Row<OrderType>;
}> = ({ row }) => {
  const { productKey } = row.original;
  const {
    query: { data: products },
  } = useProducts();

  if (!products) return null;

  const productName = products.find((p) => p.uuid === productKey.product)?.name;

  return productName;
};

export const columns: ColumnDef<OrderType>[] = [
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
      return value.includes(row.getValue(id));
    },
    accessorFn: (row) => row.productKey.product,
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
    cell: ({ row }) => {
      const { productKey } = row.original;
      return formatDuration(productKey.duration);
    },
    filterFn: (row, id, value: number[]) => {
      return value.includes(row.original.productKey.duration);
    },
    sortingFn: sortByVariant,
    accessorFn: (row) => row.productKey.duration,
  },
];
