import { type ColumnDef } from "@tanstack/react-table";
import { formatISOStringToDate } from "~/lib/utils";
import { type PurchasedKeyType } from "~/types/purchasedKey";
import { Badge } from "../ui/badge";

export const columns: ColumnDef<Partial<PurchasedKeyType>>[] = [
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      const { product } = row.original;
      return <span className="font-medium">{product}</span>;
    },
  },
  {
    accessorKey: "key",
    header: "Key",
  },
  {
    accessorKey: "expiry",
    header: "Expiry",
    cell: ({ row }) => {
      const { expiry } = row.original;
      return expiry ? formatISOStringToDate(expiry) : "No Expiry";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { expiry } = row.original;

      const isExpired =
        expiry !== null &&
        expiry !== undefined &&
        new Date() >= new Date(expiry);

      return isExpired ? (
        <Badge variant="destructive" className="w-full justify-center p-0">
          Expired
        </Badge>
      ) : (
        <Badge className="w-full justify-center bg-green-500/80 p-0 text-white hover:bg-green-500/60">
          Active
        </Badge>
      );
    },
  },
];
