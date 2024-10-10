import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import MyKeysTable from "./table";

const MyKeys = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Keys</CardTitle>
        <CardDescription>
          A list of keys that you have purchased.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <MyKeysTable />
      </CardContent>
    </Card>
  );
};

export default MyKeys;
