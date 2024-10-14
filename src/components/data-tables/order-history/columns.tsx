import { type ColumnDef } from "@tanstack/react-table";
import {
  dateFilterFn,
  formatDuration,
  formatISOStringToDate,
  sortByVariant,
} from "~/lib/utils";
import { type OrderType } from "~/types/order";
import { DataTableColumnHeader } from "../../data-table-column-header";

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
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
    accessorFn: (row) => row.productKey.product.name,
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
