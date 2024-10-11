import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { filterFn, formatISOStringToDate } from "~/lib/utils";
import { useUIStore } from "~/state/ui.store";
import { roles, type RoleType, type UserType } from "~/types/user";
import { DataTableColumnHeader } from "../../DataTableColumnHeader";

const RoleCell: React.FC<{
  value: RoleType;
  onEdit: (value: RoleType) => void;
}> = ({ value, onEdit }) => {
  const { editMode } = useUIStore();

  if (editMode) {
    return (
      <Select defaultValue={value} onValueChange={onEdit}>
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

  return <Badge className="capitalize">{value}</Badge>;
};

type TableProps = {
  onEdit: (product: Partial<UserType>) => void;
};

export const getColumns = ({
  onEdit,
}: TableProps): ColumnDef<Partial<UserType>>[] => [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Joined" />
    ),
    cell: ({ row }) => {
      const { createdAt } = row.original;

      if (!createdAt) return null;

      return formatISOStringToDate(createdAt);
    },
    filterFn: filterFn,
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
          onEdit={(value) => onEdit({ ...row.original, role: value })}
        />
      );
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
];
