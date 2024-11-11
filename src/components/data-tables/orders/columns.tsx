import { type ColumnDef, type Row } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import useMyKeys from "~/hooks/useMyKeys";
import useUsers from "~/hooks/useUsers";
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

const PurchasedByCell: React.FC<{ row: Row<OrderType> }> = ({ row }) => {
  const {
    query: { data: users },
  } = useUsers();

  return (
    <span className="capitalize">
      {users?.find((user) => user.uuid === row.original.purchasedBy)
        ?.username ?? ""}
    </span>
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
    cell: ({ row }) => (
      <a
        href={row.original.invoiceLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-max items-center gap-1 underline underline-offset-4"
      >
        View Invoice <ExternalLink size={16} />
      </a>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "purchasedBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purchased By" />
    ),
    cell: ({ row }) => <PurchasedByCell row={row} />,
  },
];
