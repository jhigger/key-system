import { type ColumnDef, type Row } from "@tanstack/react-table";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
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
import { roles, type RoleType, type UserType } from "~/types/user";
import { DataTableColumnHeader } from "../../data-table-column-header";

const RoleCell: React.FC<{
  row: Row<UserType>;
}> = ({ row }) => {
  const { editMode } = useUIStore();
  const [currentRole, setCurrentRole] = useState<RoleType>(row.original.role);
  const {
    mutation: { changeRole },
  } = useUsers();

  if (editMode) {
    return (
      <Select
        value={currentRole}
        onValueChange={(newRole) => {
          setCurrentRole(newRole as RoleType);
          changeRole({ ...row.original, role: newRole as RoleType });
        }}
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

  return <Badge className="capitalize">{currentRole}</Badge>;
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
    filterFn: (row, id, value: string) => {
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
];
