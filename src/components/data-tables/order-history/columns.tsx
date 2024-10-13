import { type ColumnDef } from "@tanstack/react-table";
import { dateFilterFn, formatISOStringToDate } from "~/lib/utils";
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
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
    sortingFn: (rowA, rowB) => {
      const variantA = rowA.original.variant?.split(" ")[0];
      const variantB = rowB.original.variant?.split(" ")[0];

      // Treat "Lifetime" as the highest priority
      if (variantA === "Lifetime" && variantB !== "Lifetime") return 1;
      if (variantB === "Lifetime" && variantA !== "Lifetime") return -1;

      if (!variantA || !variantB) return 0;

      // If both are not "Lifetime", sort by their numeric value
      const valueA = parseFloat(variantA) || 0;
      const valueB = parseFloat(variantB) || 0;

      // Compare other variants based on their numeric value
      return valueA - valueB;
    },
  },
];
