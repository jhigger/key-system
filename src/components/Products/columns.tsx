import { type ColumnDef } from "@tanstack/react-table";
import { formatPrice } from "~/lib/utils";
import { type ProductType } from "~/types/product";
import { variants } from "~/types/variant";

export const columns: ColumnDef<Partial<ProductType>>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const { name } = row.original;
      return <span className="font-medium">{name}</span>;
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
    };
  }),
  {
    accessorKey: "stock",
    header: "Stock",
  },
];
