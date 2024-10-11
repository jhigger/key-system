import { DataTable } from "../../ui/data-table";
import { columns } from "./columns";
import { orders } from "./orders";

const OrderHistoryTable = () => {
  return <DataTable columns={columns} data={orders} />;
};

export default OrderHistoryTable;
