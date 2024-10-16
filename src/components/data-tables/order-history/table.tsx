import { useMemo } from "react";
import useProducts from "~/hooks/useProducts";
import { type OrderType } from "~/types/order";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";

type OrderHistoryTableProps = {
  orders: OrderType[];
};

const OrderHistoryTable = ({ orders }: OrderHistoryTableProps) => {
  const {
    query: { data: products },
  } = useProducts();

  const columns = useMemo(() => getColumns({ products }), [products]);

  return <DataTable columns={columns} data={orders} />;
};

export default OrderHistoryTable;
