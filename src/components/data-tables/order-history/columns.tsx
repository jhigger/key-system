import { type ColumnDef } from "@tanstack/react-table";
import {
  dateFilterFn,
  formatDuration,
  formatISOStringToDate,
  sortByVariant,
} from "~/lib/utils";
import { type OrderTypeWithVariant } from "~/types/order";
import { DataTableColumnHeader } from "../../data-table-column-header";

export const columns: ColumnDef<OrderTypeWithVariant>[] = [
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
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "invoiceLink",
    header: "Invoice Link",
    enableSorting: false,
  },
  {
    accessorKey: "variant",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Variant" />
    ),
    cell: ({ row }) => {
      const { variant } = row.original;
      return formatDuration(variant);
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
    sortingFn: sortByVariant,
  },
];
