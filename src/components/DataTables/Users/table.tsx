import { useMemo } from "react";
import useUsers from "~/hooks/useUsers";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";

const UsersTable = () => {
  const {
    query: { data: users },
    mutation: { changeRole },
  } = useUsers();

  const columns = useMemo(
    () =>
      getColumns({
        editUser: changeRole,
      }),
    [changeRole],
  );

  return <DataTable columns={columns} data={users ?? []} />;
};

export default UsersTable;
