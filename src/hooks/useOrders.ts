import { useQuery } from "@tanstack/react-query";
import { getOrders } from "~/data-access/orders";
import useAuthToken from "./useAuthToken";

const useOrders = (userUUID?: string) => {
  const getToken = useAuthToken();

  const query = useQuery({
    queryKey: ["orders", userUUID],
    queryFn: () => getOrders(getToken, userUUID),
    enabled: !!userUUID,
  });


  const allOrdersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(getToken),
  });

  return { query, allOrdersQuery };
};

export default useOrders;
