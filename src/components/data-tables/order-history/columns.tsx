import { type ColumnDef, type Row } from "@tanstack/react-table";
import useProducts from "~/hooks/useProducts";
import {
  dateFilterFn,
  formatDuration,
  formatISOStringToDate,
  getProductPricingDuration,
  sortByVariant,
} from "~/lib/utils";
import { type OrderType } from "~/types/order";
import { type ProductType } from "~/types/product";
import { DataTableColumnHeader } from "../../data-table-column-header";

const ProductCell: React.FC<{
  row: Row<OrderType>;
}> = ({ row }) => {
  const { productKey } = row.original;
  const {
    query: { data: products },
  } = useProducts();

  if (!products) return null;

  const productName = products.find(
    (p) => p.uuid === productKey.productId,
  )?.name;

  return productName;
};

const VariantCell: React.FC<{
  row: Row<OrderType>;
}> = ({ row }) => {
  const { productKey } = row.original;
  const {
    query: { data: products },
  } = useProducts();

  if (!products) return null;

  const duration = getProductPricingDuration(productKey.pricingId, products);
  return formatDuration(duration);
};

export const getColumns = ({
  products,
}: {
  products?: ProductType[];
}): ColumnDef<OrderType>[] => [
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
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => <ProductCell row={row} />,
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
    accessorFn: (row) => row.productKey.productId,
  },
  {
    accessorKey: "invoiceLink",
    header: "Invoice Link",
    enableSorting: false,
  },
  {
    id: "variant",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Variant" />
    ),
    cell: ({ row }) => <VariantCell row={row} />,
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.original.productKey.pricingId);
    },
    sortingFn: (rowA, rowB) => sortByVariant(rowA, rowB, products ?? []),
    accessorFn: (row) => row.productKey.pricingId,
  },
];
