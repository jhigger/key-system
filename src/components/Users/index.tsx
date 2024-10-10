import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import UsersTable from "./table";

const Users = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>A list of users who are registered.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <UsersTable />
      </CardContent>
    </Card>
  );
};

export default Users;
