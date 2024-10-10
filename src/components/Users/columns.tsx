import { type ColumnDef } from "@tanstack/react-table";
import { type UserType } from "~/types/user";
import { Badge } from "../ui/badge";

export const columns: ColumnDef<Partial<UserType>>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const { email } = row.original;
      return <span className="font-medium">{email}</span>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const { role } = row.original;
      return <Badge className="capitalize">{role}</Badge>;
    },
  },
];
