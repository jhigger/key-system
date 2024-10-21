import { type ColumnDef, type Row } from "@tanstack/react-table";
import { Check, Menu } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import useUsers from "~/hooks/useUsers";
import { dateFilterFn, formatISOStringToDate } from "~/lib/utils";
import { useUIStore } from "~/state/ui.store";
import { useUserStore } from "~/state/user.store";
import { roles, type RoleType, type UserType } from "~/types/user";
import { DataTableColumnHeader } from "../../data-table-column-header";

const RoleCell: React.FC<{
  row: Row<UserType>;
}> = ({ row }) => {
  const { editMode } = useUIStore();
  const {
    mutation: { changeRole },
  } = useUsers();
  const { user: currentUser } = useUserStore();

  if (editMode) {
    return (
      <Select
        value={row.original.role}
        onValueChange={(newRole) => {
          changeRole({
            uuid: row.original.uuid,
            clerkId: row.original.clerkId,
            role: newRole as RoleType,
          });
        }}
        disabled={
          currentUser?.uuid === row.original.uuid ||
          row.original.email === "njohnjhigger@gmail.com"
        }
      >
        <SelectTrigger className="w-[180px] capitalize">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((option) => (
            <SelectItem key={option} value={option} className="capitalize">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return <Badge className="capitalize">{row.original.role}</Badge>;
};

const UserActionsCell: React.FC<{
  row: Row<UserType>;
}> = ({ row }) => {
  const { user: currentUser } = useUserStore();
  const {
    mutation: { approveUser },
  } = useUsers();

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
            variant={"ghost"}
            size={"sm"}
            onClick={() =>
              approveUser({
                uuid: row.original.uuid,
                approvedBy: currentUser?.uuid ?? null,
              })
            }
            disabled={row.original.approvedBy !== null}
          >
            Approve <Check size={16} />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const getColumns = (): ColumnDef<UserType>[] => [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Joined" />
    ),
    cell: ({ row }) => {
      const { createdAt } = row.original;

      if (!createdAt) return null;

      const { formattedDate, formattedTime } = formatISOStringToDate(createdAt);
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
    id: "dateGlobalFilter",
    header: () => null,
    cell: () => null,
    accessorFn: (row) =>
      formatISOStringToDate(row.createdAt).formattedDate +
      " " +
      formatISOStringToDate(row.createdAt).formattedTime,
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => <RoleCell row={row} />,
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "orders",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Keys" />
    ),
    cell: ({ row }) => {
      const { orders } = row.original;
      return orders ? orders.length : 0;
    },
  },
  {
    accessorKey: "approvedBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const { approvedBy } = row.original;
      if (approvedBy) {
        return (
          <Badge className="shrink-0 justify-center bg-green-500/80 text-white hover:bg-green-500/60">
            Approved
          </Badge>
        );
      }
      return (
        <Badge className="shrink-0 justify-center bg-yellow-500/80 text-white hover:bg-yellow-500/60">
          Pending
        </Badge>
      );
    },
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id) ? "approved" : "pending");
    },
    accessorFn: (row) => (row.approvedBy ? "approved" : "pending"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <UserActionsCell row={row} />,
  },
];
