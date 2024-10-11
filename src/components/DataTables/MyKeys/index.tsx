import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { keys } from "./keys";
import MyKeysTable from "./table";

const MyKeys = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-y-1.5">
            <CardTitle>My Keys</CardTitle>
            <CardDescription>
              A list of keys that you have purchased.
            </CardDescription>
          </div>
          <div className="flex flex-col items-end justify-between">
            <CardTitle>{keys.length}</CardTitle>
            <CardDescription>Total</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <MyKeysTable />
      </CardContent>
    </Card>
  );
};

export default MyKeys;
