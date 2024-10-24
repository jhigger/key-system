import Loader from "~/components/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import useMyKeys from "~/hooks/useMyKeys";
import { useUserStore } from "~/state/user.store";
import MyKeysTable from "./table";

const MyKeys = () => {
  const { user } = useUserStore();
  const {
    query: { data: keys, isLoading, isError },
  } = useMyKeys(user?.uuid ?? "");

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
                <CardTitle>My Keys</CardTitle>
                <CardDescription>
                  A list of keys that you have purchased.
                </CardDescription>
              </div>
              <div className="flex flex-col items-end justify-between">
                <CardTitle>{keys?.length ?? 0}</CardTitle>
                <CardDescription>Total</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <MyKeysTable />
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default MyKeys;
