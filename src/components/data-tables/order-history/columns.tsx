import { type ColumnDef, type Row } from "@tanstack/react-table";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import useMyKeys from "~/hooks/useMyKeys";
import {
  dateFilterFn,
  formatDuration,
  formatISOStringToDate,
} from "~/lib/utils";
import { type OrderType } from "~/types/order";
import { DataTableColumnHeader } from "../../data-table-column-header";

const ProductCell: React.FC<{
  row: Row<OrderType>;
}> = ({ row }) => {
  const { user } = useCurrentUser();
  const { uuid: orderUUID } = row.original;
  const {
    productKeySnapshotsByOrderQuery
  } = useMyKeys(user?.uuid ?? "", orderUUID);

  if (!productKeySnapshotsByOrderQuery.data) return null;

  return (
    <>
      {productKeySnapshotsByOrderQuery.data.map((productKey) => (
        <div
          key={productKey.uuid}
          className="-mr-4 -translate-x-4 border-b py-2 pl-4 last:border-b-0"
        >
          {productKey.productName}
        </div>
      ))}
    </>
  );
};

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

  return (
    <>
      {productKeySnapshotsByOrderQuery.data.map((productKey) => (
        <div
          key={productKey.uuid}
          className="-mr-4 -translate-x-4 border-b py-2 pl-4 last:border-b-0"
        >
          {formatDuration(productKey.pricing.duration)}
        </div>
      ))}
    </>
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
    accessorKey: "productKeysSnapshot.productName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => <ProductCell row={row} />,
  },
  {
    id: "productKeysSnapshot.pricing.duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Variant" />
    ),
    cell: ({ row }) => <VariantCell row={row} />,
  },
  {
    accessorKey: "invoiceLink",
    header: "Invoice Link",
    enableSorting: false,
  },
];
