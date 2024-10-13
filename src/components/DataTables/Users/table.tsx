import { useMemo } from "react";
import useUsers from "~/hooks/useUsers";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";

const UsersTable = () => {
  const {
    query: { data: users },
    mutation: { mutate },
  } = useUsers();

  const columns = useMemo(
    () =>
      getColumns({
        editUser: mutate,
      }),
    [mutate],
  );

  return <DataTable columns={columns} data={users ?? []} />;
};

export default UsersTable;
