import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { orders } from "./orders";
import OrderHistoryTable from "./table";

const OrderHistory = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-y-1.5">
            <CardTitle>Order History</CardTitle>
            <CardDescription>
              A list of your recent transactions.
            </CardDescription>
          </div>
          <div className="flex flex-col items-end justify-between">
            <CardTitle>{orders.length}</CardTitle>
            <CardDescription>Total</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <OrderHistoryTable />
      </CardContent>
    </Card>
  );
};

export default OrderHistory;
