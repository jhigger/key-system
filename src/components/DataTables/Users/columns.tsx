import { type ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { dateFilterFn, formatISOStringToDate } from "~/lib/utils";
import { useUIStore } from "~/state/ui.store";
import { roles, type RoleType, type UserType } from "~/types/user";
import { DataTableColumnHeader } from "../../DataTableColumnHeader";

const RoleCell: React.FC<{
  value: RoleType;
  changeRole: (role: RoleType) => void;
}> = ({ value, changeRole }) => {
  const { editMode } = useUIStore();
  const [currentRole, setCurrentRole] = useState<RoleType>(value);

  if (editMode) {
    return (
      <Select
        value={currentRole}
        onValueChange={(newRole) => {
          setCurrentRole(newRole as RoleType);
          changeRole(newRole as RoleType);
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

type TableProps = {
  editUser: (user: UserType) => void;
};

export const getColumns = ({ editUser }: TableProps): ColumnDef<UserType>[] => [
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
    cell: ({ row }) => {
      const role: RoleType = row.getValue("role");
      return (
        <RoleCell
          value={role}
          changeRole={(newRole) => editUser({ ...row.original, role: newRole })}
        />
      );
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
];
