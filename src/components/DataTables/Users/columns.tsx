import { type ColumnDef } from "@tanstack/react-table";
import { formatISOStringToDate } from "~/lib/utils";
import { type UserType } from "~/types/user";
import { DataTableColumnHeader } from "../../DataTableColumnHeader";
import { Badge } from "../../ui/badge";

export const columns: ColumnDef<Partial<UserType>>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Joined" />
    ),
    cell: ({ row }) => {
      const { createdAt } = row.original;

      if (!createdAt) return null;

      return (
        <span className="font-medium">{formatISOStringToDate(createdAt)}</span>
      );
    },
    filterFn: (row, columnId, filterValue: [Date, Date]) => {
      const { createdAt } = row.original;

      if (!createdAt) return false;

      const createdAtDate = new Date(createdAt);
      const [startDate, endDate] = filterValue;

      // Check if the createdAt date falls within the specified range
      return createdAtDate >= startDate && createdAtDate <= endDate;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const { email } = row.original;
      return <span className="font-medium">{email}</span>;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const { role } = row.original;
      return <Badge className="capitalize">{role}</Badge>;
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
];
