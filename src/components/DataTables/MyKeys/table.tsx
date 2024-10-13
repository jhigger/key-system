import { useMemo } from "react";
import useMyKeys from "~/hooks/useMyKeys";
import { useUserStore } from "~/state/user.store";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";

const MyKeysTable = () => {
  const { user } = useUserStore();
  const {
    query: { data: keys },
    mutation: { mutate },
  } = useMyKeys(user?.uuid);

  const columns = useMemo(
    () =>
      getColumns({
        resetHardwareId: mutate,
      }),
    [mutate],
  );

  return <DataTable columns={columns} data={keys ?? []} />;
};

export default MyKeysTable;
