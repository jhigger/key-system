import { DataTable } from "../../ui/data-table";
import { columns } from "./columns";
import { users } from "./users";

const UsersTable = () => {
  return <DataTable columns={columns} data={users} />;
};

export default UsersTable;
