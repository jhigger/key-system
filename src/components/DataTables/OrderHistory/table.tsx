import { type OrderTypeForTable } from "~/types/order";
import { DataTable } from "../../ui/data-table";
import { columns } from "./columns";

type OrderHistoryTableProps = {
  orders: OrderTypeForTable[];
};

const OrderHistoryTable = ({ orders }: OrderHistoryTableProps) => {
  return <DataTable columns={columns} data={orders} />;
};

export default OrderHistoryTable;
