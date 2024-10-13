import { type ColumnDef, type Row } from "@tanstack/react-table";
import { Copy, Menu, Trash } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import useMyKeys from "~/hooks/useMyKeys";
import {
  censorUUID,
  copyToClipboard,
  dateFilterFn,
  formatISOStringToDate,
} from "~/lib/utils";
import { useUserStore } from "~/state/user.store";
import { type ProductKeyTypeWithStatus } from "~/types/productKey";
import { DataTableColumnHeader } from "../../data-table-column-header";
import { Badge } from "../../ui/badge";

const ActionsCell: React.FC<{
  row: Row<ProductKeyTypeWithStatus>;
}> = ({ row }) => {
  const { user } = useUserStore();
  const {
    mutation: { resetHardwareId },
  } = useMyKeys(user?.uuid);
  const { hardwareId, expiry } = row.original;
  const isExpired = expiry ? new Date(expiry) < new Date() : false;

  if (!hardwareId) return null;

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
            onClick={() => resetHardwareId(hardwareId)}
            disabled={!hardwareId || isExpired}
          >
            Reset HWID <Trash size={16} />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const getColumns = (): ColumnDef<ProductKeyTypeWithStatus>[] => [
  {
    accessorKey: "expiry",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expiry" />
    ),
    cell: ({ row }) => {
      const { expiry } = row.original;

      if (!expiry) return "No Expiry";

      const { formattedDate, formattedTime } = formatISOStringToDate(expiry);
      return (
        <div className="flex flex-col gap-1 font-mono">
          <span>{formattedDate}</span>
          <span>{formattedTime}</span>
        </div>
      );
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
    filterFn: dateFilterFn,
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const { status } = row.original;

      return status === "expired" ? (
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
      const { status } = row.original;
      return filterValue.includes(status);
    },
    enableSorting: false,
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
    accessorKey: "key",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Key" />
    ),
    cell: ({ row }) => {
      const { key } = row.original;

      if (!key) return null;

      return (
        <Button
          variant={"ghost"}
          size={"sm"}
          className="-ml-3 min-w-full max-w-40 gap-2"
          onClick={() =>
            copyToClipboard(key)
              .then(() => toast.success("Key copied to clipboard"))
              .catch(() => toast.error("Failed to copy key"))
          }
          title={"Click to copy full key"}
        >
          <span className="truncate">{censorUUID(key)}</span>
          {key && <Copy size={16} className="shrink-0 text-gray-500" />}
        </Button>
      );
    },
  },
  {
    accessorKey: "hardwareId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hardware ID" />
    ),
    cell: ({ row }) => {
      const { hardwareId } = row.original;

      if (!hardwareId) return "None";

      return (
        <Button
          variant={"ghost"}
          size={"sm"}
          className="-ml-3 min-w-full max-w-40 gap-2"
          onClick={() =>
            copyToClipboard(hardwareId)
              .then(() => toast.success("Hardware ID copied to clipboard"))
              .catch(() => toast.error("Failed to copy Hardware ID"))
          }
          title={"Click to copy full Hardware ID"}
        >
          <span className="truncate">{censorUUID(hardwareId)}</span>
          <Copy size={16} className="shrink-0 text-gray-500" />
        </Button>
      );
    },
  },
  {
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
