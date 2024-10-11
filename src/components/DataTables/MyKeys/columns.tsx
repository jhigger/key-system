import { type ColumnDef } from "@tanstack/react-table";
import { Menu, Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { filterFn, formatISOStringToDate } from "~/lib/utils";
import { type PurchasedKeyType } from "~/types/purchasedKey";
import { DataTableColumnHeader } from "../../DataTableColumnHeader";
import { Badge } from "../../ui/badge";

type TableProps = {
  onDelete: (hardwareId?: string | null) => void;
};

export const getColumns = ({
  onDelete,
}: TableProps): ColumnDef<Partial<PurchasedKeyType>>[] => [
  {
    accessorKey: "expiry",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expiry" />
    ),
    cell: ({ row }) => {
      const { expiry } = row.original;
      return expiry ? formatISOStringToDate(expiry) : "No Expiry";
    },
    sortingFn: (rowA, rowB) => {
      const expiryA = rowA.original.expiry;
      const expiryB = rowB.original.expiry;

      // If expiryA is undefined or null, treat it as the highest
      if (!expiryA) return 1; // rowA goes after rowB
      if (!expiryB) return -1; // rowB goes after rowA

      const dateA = new Date(expiryA);
      const dateB = new Date(expiryB);

      // Handle invalid dates
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        return 0; // Treat invalid dates as equal
      }

      // Compare dates
      return dateA.getTime() - dateB.getTime(); // Ascending order
    },
    filterFn: filterFn,
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const { expiry } = row.original;

      const isExpired =
        expiry !== null &&
        expiry !== undefined &&
        new Date() >= new Date(expiry);

      return isExpired ? (
        <Badge variant="destructive" className="w-full justify-center px-1">
          Expired
        </Badge>
      ) : (
        <Badge className="w-full justify-center bg-green-500/80 px-1 text-white hover:bg-green-500/60">
          Active
        </Badge>
      );
    },
    filterFn: (row, _, filterValue: string[]) => {
      const { expiry } = row.original;

      if (!expiry) return false;

      const isExpired = new Date() >= new Date(expiry);
      const status = isExpired ? "Expired" : "Active";
      return filterValue.includes(status);
    },
    enableSorting: false,
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
  {
    accessorKey: "key",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Key" />
    ),
  },
  {
    accessorKey: "hardwareId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hardware ID" />
    ),
    cell: ({ row }) => {
      const { hardwareId } = row.original;
      const censoredHardwareId = hardwareId
        ? hardwareId.slice(0, -12) + "*".repeat(12)
        : "None";
      return hardwareId ? <span>{censoredHardwareId}</span> : "None";
    },
  },
  {
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => {
      const { hardwareId, expiry } = row.original;
      const isExpired = expiry ? new Date(expiry) < new Date() : false;

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
                onClick={() => onDelete(hardwareId)}
                disabled={!hardwareId || isExpired}
              >
                Reset HWID <Trash size={16} />
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
