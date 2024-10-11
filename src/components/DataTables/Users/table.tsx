import { useCallback, useMemo, useState } from "react";
import { type UserType } from "~/types/user";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";
import { users } from "./users";

const UsersTable = () => {
  const [data, setData] = useState<Partial<UserType>[]>(users);

  const handleEdit = useCallback((updatedUser: Partial<UserType>) => {
    setData((prevData) =>
      prevData.map((user) =>
        user.uuid === updatedUser.uuid ? { ...user, ...updatedUser } : user,
      ),
    );
  }, []);

  const columns = useMemo(
    () => getColumns({ onEdit: handleEdit }),
    [handleEdit],
  );

  return <DataTable columns={columns} data={data} />;
};

export default UsersTable;
