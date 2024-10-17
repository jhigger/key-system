import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addOrder, getOrders } from "~/data-access/orders";
import { type OrderType } from "~/types/order";

const useOrders = (userUUID?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["orders", userUUID],
    queryFn: () => getOrders(userUUID),
    enabled: !!userUUID,
  });

  const addOrderMutation = useMutation({
    mutationFn: (order: OrderType) => addOrder(order),
    onMutate: async () => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["orders"] });

      // Snapshot the previous value
      const previousOrders = queryClient.getQueryData<OrderType[]>(["orders"]);

      // Return a context object with the snapshotted value
      return { previousOrders };
    },
    onSuccess: (newOrder) => {
      // Optimistically update orders
      queryClient.setQueryData<OrderType[]>(["orders"], (old) => {
        if (!old) return [newOrder];
        return [...old, newOrder];
      });
      toast.success("Order added successfully");
    },
    onError: (error, variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(["orders"], context?.previousOrders);
      }
      toast.error(error.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return { query, mutation: { addOrder: addOrderMutation.mutate } };
};

export default useOrders;
