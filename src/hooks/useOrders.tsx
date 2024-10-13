import { useQuery } from "@tanstack/react-query";
import { getOrders } from "~/data-access/orders";

const useOrders = (userUUID?: string) => {
  const query = useQuery({
    queryKey: ["orders", userUUID],
    queryFn: () => getOrders(userUUID),
    enabled: !!userUUID,
  });

  return { query };
};

export default useOrders;
