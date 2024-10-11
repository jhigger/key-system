import { DataTable } from "../../ui/data-table";
import { columns } from "./columns";
import { keys } from "./keys";

const MyKeysTable = () => {
  return <DataTable columns={columns} data={keys} />;
};

export default MyKeysTable;
