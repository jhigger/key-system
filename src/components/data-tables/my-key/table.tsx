import { useMemo } from "react";
import useMyKeys from "~/hooks/useMyKeys";
import useProducts from "~/hooks/useProducts";
import { useUserStore } from "~/state/user.store";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";

const MyKeysTable = () => {
  const { user } = useUserStore();
  const {
    query: { data: keys },
  } = useMyKeys(user?.id);
  const {
    query: { data: products },
  } = useProducts();

  const columns = useMemo(() => getColumns({ products }), [products]);

  return <DataTable columns={columns} data={keys ?? []} />;
};

export default MyKeysTable;
