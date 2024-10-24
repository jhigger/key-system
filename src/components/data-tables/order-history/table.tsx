import { useMemo } from "react";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import useOrders from "~/hooks/useOrders";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";

const OrderHistoryTable = () => {
  const { user } = useCurrentUser();
  const {
    query: { data: orders },
  } = useOrders(user?.uuid ?? "");

  const columns = useMemo(() => getColumns(), []);

  return <DataTable columns={columns} data={orders ?? []} />;
};

export default OrderHistoryTable;
