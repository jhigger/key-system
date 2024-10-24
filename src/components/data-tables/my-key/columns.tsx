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
  getStatus,
} from "~/lib/utils";
import { useUserStore } from "~/state/user.store";
import { type ProductKeySnapshotType } from "~/types/productKeySnapshot";
import { DataTableColumnHeader } from "../../data-table-column-header";
import { Badge } from "../../ui/badge";

const ActionsCell: React.FC<{
  row: Row<ProductKeySnapshotType>;
}> = ({ row }) => {
  const { user } = useUserStore();
  const {
    mutation: { resetHardwareId },
  } = useMyKeys(user?.uuid ?? "");
  const { hardwareId } = row.original;
  const isExpired = row.original.expiry
    ? new Date(row.original.expiry) < new Date()
    : false;

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
            onClick={() => resetHardwareId(hardwareId ?? "")}
            disabled={!hardwareId || isExpired}
          >
            Reset HWID <Trash size={16} />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ProductCell: React.FC<{
  row: Row<ProductKeySnapshotType>;
}> = ({ row }) => {
  const { productName } = row.original;

  return productName;
};

export const getColumns = (): ColumnDef<ProductKeySnapshotType>[] => [
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
    id: "dateGlobalFilter",
    header: () => null,
    cell: () => null,
    accessorFn: (row) => {
      const { expiry } = row;
      if (!expiry) return "No Expiry";
      return (
        formatISOStringToDate(expiry).formattedDate +
        " " +
        formatISOStringToDate(expiry).formattedTime
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const { expiry } = row.original;

      return getStatus(expiry) === "expired" ? (
        <Badge variant="destructive" className="shrink-0 justify-center">
          Expired
        </Badge>
      ) : (
        <Badge className="shrink-0 justify-center bg-green-500/80 text-white hover:bg-green-500/60">
          Active
        </Badge>
      );
    },
    filterFn: (row, _, filterValue: string[]) => {
      const { expiry } = row.original;
      if (!expiry) return false;
      return filterValue.includes(getStatus(expiry));
    },
    accessorFn: (row) => getStatus(row.expiry),
  },
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => <ProductCell row={row} />,
    filterFn: (row, id, value: string[]) => {
      const { productName } = row.original;
      return value.includes(productName);
    },
    accessorFn: (row) => row.productName,
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
          {hardwareId && <Copy size={16} className="shrink-0 text-gray-500" />}
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
