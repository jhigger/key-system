import { Loader } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import useOrders from "~/hooks/useOrders";
import { useUserStore } from "~/state/user.store";
import OrderHistoryTable from "./table";

const OrderHistory = () => {
  const { user } = useUserStore();
  const {
    query: { data: orders, isLoading, isError },
  } = useOrders(user?.uuid ?? "");

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
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  A list of your recent transactions.
                </CardDescription>
              </div>
              <div className="flex flex-col items-end justify-between">
                <CardTitle>{orders?.length ?? 0}</CardTitle>
                <CardDescription>Total</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <OrderHistoryTable />
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default OrderHistory;
