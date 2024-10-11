import { type ColumnDef } from "@tanstack/react-table";
import { formatISOStringToDate, formatPrice } from "~/lib/utils";
import { type ProductType } from "~/types/product";
import { variants } from "~/types/variant";
import { DataTableColumnHeader } from "../../DataTableColumnHeader";

export const columns: ColumnDef<Partial<ProductType>>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Created" />
    ),
    cell: ({ row }) => {
      const { createdAt: purchasedAt } = row.original;

      if (!purchasedAt) return null;

      return (
        <span className="font-medium">
          {formatISOStringToDate(purchasedAt)}
        </span>
      );
    },
    filterFn: (row, columnId, filterValue: [Date, Date]) => {
      const { createdAt } = row.original;

      if (!createdAt) return false;

      const createdAtDate = new Date(createdAt);
      const [startDate, endDate] = filterValue;

      // Check if the createdAt date falls within the specified range
      return createdAtDate >= startDate && createdAtDate <= endDate;
    },
  },
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      const { product } = row.original;
      return <span className="font-medium">{product}</span>;
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  ...variants.map<ColumnDef<Partial<ProductType>>>(({ name, value }) => {
    return {
      accessorKey: name,
      header: ({ table }) => {
        const firstRow = table.getRow("0");
        const pricing = firstRow.original.pricing;

        if (!pricing) return null;

        return <span>{name}</span>;
      },
      cell: ({ row }) => {
        const { pricing } = row.original;

        if (!pricing?.[1]) return null;

        return <span>{formatPrice(Number(value))}</span>;
      },
      enableSorting: false,
    };
  }),
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
  },
];
