import { useMemo } from "react";
import useOrders from "~/hooks/useOrders";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";

const OrdersTable = () => {
  const {
    allOrdersQuery: { data: orders },
  } = useOrders();

  const columns = useMemo(() => getColumns(), []);

  return <DataTable columns={columns} data={orders ?? []} isEditable={false} />;
};

export default OrdersTable;
