import { type ColumnDef } from "@tanstack/react-table";
import { formatISOStringToDate } from "~/lib/utils";
import { type PurchasedKeyType } from "~/types/purchasedKey";

export const columns: ColumnDef<Partial<PurchasedKeyType>>[] = [
  {
    accessorKey: "purchasedAt",
    header: "Date Purchased",
    cell: ({ row }) => {
      const { purchasedAt } = row.original;

      if (!purchasedAt) return null;

      return (
        <span className="font-medium">
          {formatISOStringToDate(purchasedAt)}
        </span>
      );
    },
  },
  {
    accessorKey: "product",
    header: "Product",
  },
  {
    accessorKey: "invoiceLink",
    header: "Invoice Link",
  },
  {
    accessorKey: "variant",
    header: "Variant",
  },
];
