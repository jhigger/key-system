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
import { type OrderType } from "~/types/order";
import { DataTableColumnHeader } from "../../data-table-column-header";
import { Badge } from "../../ui/badge";

const ActionsCell: React.FC<{
  row: Row<OrderType>;
}> = ({ row }) => {
  const { user } = useUserStore();
  const {
    mutation: { resetHardwareId },
  } = useMyKeys(user?.uuid);
  const { productKeySnapshot } = row.original;
  const isExpired = productKeySnapshot.expiry
    ? new Date(productKeySnapshot.expiry) < new Date()
    : false;

  if (!productKeySnapshot.hardwareId) return null;

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
            onClick={() => resetHardwareId(productKeySnapshot.hardwareId ?? "")}
            disabled={!productKeySnapshot.hardwareId || isExpired}
          >
            Reset HWID <Trash size={16} />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ProductCell: React.FC<{
  row: Row<OrderType>;
}> = ({ row }) => {
  const { productKeySnapshot } = row.original;
  return productKeySnapshot.productName;
};

export const getColumns = (): ColumnDef<OrderType>[] => [
  {
    accessorKey: "expiry",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expiry" />
    ),
    cell: ({ row }) => {
      const { productKeySnapshot } = row.original;

      if (!productKeySnapshot.expiry) return "No Expiry";

      const { formattedDate, formattedTime } = formatISOStringToDate(
        productKeySnapshot.expiry,
      );
      return (
        <div className="flex flex-col gap-1 font-mono">
          <span>{formattedDate}</span>
          <span>{formattedTime}</span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const expiryA = rowA.original.productKeySnapshot.expiry;
      const expiryB = rowB.original.productKeySnapshot.expiry;

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
      if (!row.productKeySnapshot.expiry) return "No Expiry";
      return (
        formatISOStringToDate(row.productKeySnapshot.expiry).formattedDate +
        " " +
        formatISOStringToDate(row.productKeySnapshot.expiry).formattedTime
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const { productKeySnapshot } = row.original;

      return getStatus(productKeySnapshot.expiry) === "expired" ? (
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
      const { productKeySnapshot } = row.original;
      return filterValue.includes(getStatus(productKeySnapshot.expiry));
    },
    accessorFn: (row) => getStatus(row.productKeySnapshot.expiry),
  },
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => <ProductCell row={row} />,
    filterFn: (row, id, value: string[]) => {
      const { productKeySnapshot } = row.original;
      return value.includes(productKeySnapshot.productName);
    },
    accessorFn: (row) => {
      const { productKeySnapshot } = row;
      return productKeySnapshot.productName;
    },
  },
  {
    accessorKey: "key",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Key" />
    ),
    cell: ({ row }) => {
      const { productKeySnapshot } = row.original;

      if (!productKeySnapshot.key) return null;

      return (
        <Button
          variant={"ghost"}
          size={"sm"}
          className="-ml-3 min-w-full max-w-40 gap-2"
          onClick={() =>
            copyToClipboard(productKeySnapshot.key)
              .then(() => toast.success("Key copied to clipboard"))
              .catch(() => toast.error("Failed to copy key"))
          }
          title={"Click to copy full key"}
        >
          <span className="truncate">{censorUUID(productKeySnapshot.key)}</span>
          {productKeySnapshot.key && (
            <Copy size={16} className="shrink-0 text-gray-500" />
          )}
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
      const { productKeySnapshot } = row.original;

      if (!productKeySnapshot.hardwareId) return "None";

      return (
        <Button
          variant={"ghost"}
          size={"sm"}
          className="-ml-3 min-w-full max-w-40 gap-2"
          onClick={() =>
            copyToClipboard(productKeySnapshot.hardwareId ?? "")
              .then(() => toast.success("Hardware ID copied to clipboard"))
              .catch(() => toast.error("Failed to copy Hardware ID"))
          }
          title={"Click to copy full Hardware ID"}
        >
          <span className="truncate">
            {censorUUID(productKeySnapshot.hardwareId)}
          </span>
          {productKeySnapshot.hardwareId && (
            <Copy size={16} className="shrink-0 text-gray-500" />
          )}
        </Button>
      );
    },
    sortingFn: (rowA, rowB) => {
      const hardwareIdA = rowA.original.productKeySnapshot.hardwareId;
      const hardwareIdB = rowB.original.productKeySnapshot.hardwareId;

      if (!hardwareIdA) return 1;
      if (!hardwareIdB) return -1;

      return hardwareIdA.localeCompare(hardwareIdB);
    },
  },
  {
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
