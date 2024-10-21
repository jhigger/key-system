import { useMemo } from "react";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import useProducts from "~/hooks/useProducts";
import { type ProductType } from "~/types/product";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";

const ProductsTable = () => {
  const {
    query: { data: products },
    mutation: { addProduct },
  } = useProducts();
  const { user } = useCurrentUser();

  const columns = useMemo(() => getColumns(), []);

  if (!user) return null;

  return (
    <DataTable
      columns={
        user.role !== "admin" ? columns.slice(0, columns.length - 1) : columns
      }
      data={products ?? []}
      handleAdd={async (newRow) => addProduct(newRow as ProductType)}
    />
  );
};

export default ProductsTable;
