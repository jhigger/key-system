import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import UsersTable from "./table";
import { users } from "./users";

const Users = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-y-1.5">
            <CardTitle>Users</CardTitle>
            <CardDescription>
              A list of users who are registered.
            </CardDescription>
          </div>
          <div className="flex flex-col items-end justify-between">
            <CardTitle>{users.length}</CardTitle>
            <CardDescription>Total</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <UsersTable />
      </CardContent>
    </Card>
  );
};

export default Users;
