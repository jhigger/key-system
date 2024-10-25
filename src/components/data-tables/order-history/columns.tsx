import { type ColumnDef, type Row } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Textarea } from "~/components/ui/textarea";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import useMyKeys from "~/hooks/useMyKeys";
import {
  dateFilterFn,
  formatDuration,
  formatISOStringToDate,
} from "~/lib/utils";
import { type OrderType } from "~/types/order";
import { DataTableColumnHeader } from "../../data-table-column-header";

const VariantCell: React.FC<{
  row: Row<OrderType>;
}> = ({ row }) => {
  const { user } = useCurrentUser();
  const { uuid: orderUUID } = row.original;
  const { productKeySnapshotsByOrderQuery } = useMyKeys(
    user?.uuid ?? "",
    orderUUID,
  );

  if (!productKeySnapshotsByOrderQuery.data) return null;

  // Create a Map to track unique product keys and their counts
  const productKeyCountMap = new Map<string, number>();
  productKeySnapshotsByOrderQuery.data.forEach((productKey) => {
    const key = productKey.pricing.uuid;
    productKeyCountMap.set(key, (productKeyCountMap.get(key) ?? 0) + 1);
  });

  return (
    <>
      {Array.from(productKeyCountMap.entries()).map(([key, count]) => (
        <div
          key={key}
          className="-mr-4 -translate-x-4 border-b py-2 pl-4 last:border-b-0"
        >
          {
            productKeySnapshotsByOrderQuery.data.find(
              (pk) => pk.pricing.uuid === key,
            )?.productName
          }{" "}
          ={" "}
          {formatDuration(
            productKeySnapshotsByOrderQuery.data.find(
              (pk) => pk.pricing.uuid === key,
            )?.pricing.duration
              ? Number(
                  productKeySnapshotsByOrderQuery.data.find(
                    (pk) => pk.pricing.uuid === key,
                  )?.pricing.duration,
                )
              : 0,
          )}{" "}
          x {count}
        </div>
      ))}
    </>
  );
};

const ActionCell: React.FC<{
  row: Row<OrderType>;
}> = ({ row }) => {
  const { user } = useCurrentUser();
  const { uuid: orderUUID } = row.original;
  const { productKeySnapshotsByOrderQuery } = useMyKeys(
    user?.uuid ?? "",
    orderUUID,
  );
  const [showForm, setShowForm] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");

  useEffect(() => {
    if (productKeySnapshotsByOrderQuery.data) {
      const keysMap: Record<string, string[]> = {};
      productKeySnapshotsByOrderQuery.data.forEach((pk) => {
        const productName = pk.productName; // Assuming productName is available in the data
        const key = pk.key;
        const duration = formatDuration(pk.pricing.duration); // Assuming pricing.duration is available

        // Create a key for the product and duration
        const entryKey = `${productName} - ${duration} Keys`;
        if (!keysMap[entryKey]) {
          keysMap[entryKey] = [];
        }
        keysMap[entryKey].push(key);
      });

      // Format the textarea value
      const formattedEntries = Object.entries(keysMap).map(
        ([entryKey, keys]) => {
          return `${entryKey}\n${keys.join("\n")}`;
        },
      );

      setTextareaValue(formattedEntries.join("\n\n")); // Join all entries with a double newline
    }
  }, [productKeySnapshotsByOrderQuery.data]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(textareaValue)
      .then(() => {
        toast.success("Keys copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy keys");
      });
  };

  if (!productKeySnapshotsByOrderQuery.data) return null;

  return (
    <Drawer open={showForm} onOpenChange={setShowForm}>
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="flex h-9 min-w-20 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
        >
          View Keys
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
          <div className="mx-auto w-full max-w-screen-sm">
            <DrawerHeader>
              <DrawerTitle>Purchased Keys</DrawerTitle>
              <DrawerDescription>
                You can copy the keys of this order
              </DrawerDescription>
            </DrawerHeader>
            <div className="grid w-full gap-2 px-4">
              <Textarea
                value={textareaValue}
                className="h-[calc(100vh-22rem)]"
                disabled
              />
              <Button onClick={handleCopy}>Copy All</Button>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export const getColumns = (): ColumnDef<OrderType>[] => [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Purchased" />
    ),
    cell: ({ row }) => {
      const { createdAt: purchasedAt } = row.original;

      if (!purchasedAt) return null;

      const { formattedDate, formattedTime } =
        formatISOStringToDate(purchasedAt);
      return (
        <div className="flex flex-col gap-1 font-mono">
          <span>{formattedDate}</span>
          <span>{formattedTime}</span>
        </div>
      );
    },
    filterFn: dateFilterFn,
  },
  {
    id: "dateGlobalFilter",
    header: () => null,
    cell: () => null,
    accessorFn: (row) =>
      formatISOStringToDate(row.createdAt).formattedDate +
      " " +
      formatISOStringToDate(row.createdAt).formattedTime,
  },
  {
    id: "productKeysSnapshot.pricing.duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Variant" />
    ),
    cell: ({ row }) => <VariantCell row={row} />,
  },
  {
    accessorKey: "invoiceLink",
    header: "Invoice Link",
    enableSorting: false,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
