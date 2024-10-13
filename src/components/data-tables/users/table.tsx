import { useMemo } from "react";
import useUsers from "~/hooks/useUsers";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";

const UsersTable = () => {
  const {
    query: { data: users },
  } = useUsers();

  const columns = useMemo(() => getColumns(), []);

  return <DataTable columns={columns} data={users ?? []} />;
};

export default UsersTable;
