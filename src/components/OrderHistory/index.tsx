import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import OrderHistoryTable from "./table";

const OrderHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>A list of your recent transactions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <OrderHistoryTable />
      </CardContent>
    </Card>
  );
};

export default OrderHistory;
