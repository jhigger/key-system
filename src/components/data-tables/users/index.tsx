import { Loader } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import useUsers from "~/hooks/useUsers";
import UsersTable from "./table";

const Users = () => {
  const {
    query: { data: users, isLoading, isError },
  } = useUsers();

  if (isError) {
    return <div className="flex justify-center p-4">Error fetching data</div>;
  }

  return (
    <Card>
      {isLoading ? (
        <Loader className="p-4" />
      ) : (
        <>
          <CardHeader>
            <div className="flex justify-between gap-4">
              <div className="flex flex-col gap-y-1.5">
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  A list of users who are registered.
                </CardDescription>
              </div>
              <div className="flex flex-col items-end justify-between">
                <CardTitle>{users?.length ?? 0}</CardTitle>
                <CardDescription>Total</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <UsersTable />
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default Users;
