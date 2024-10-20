import { useMemo } from "react";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import useProductKeys from "~/hooks/useProductKeys";
import useProducts from "~/hooks/useProducts";
import { type ProductKeyType } from "~/types/productKey";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";

const ProductKeysTable = () => {
  const {
    query: { data: productKeys },
    mutation: { addProductKeys },
  } = useProductKeys();
  const {
    query: { data: products },
  } = useProducts();
  const { user } = useCurrentUser();

  const columns = useMemo(() => {
    if (!user) return null;
    const columns = getColumns({ products });
    return user.role !== "admin"
      ? columns.slice(0, columns.length - 1)
      : columns;
  }, [user, products]);

  if (!columns) return null;

  return (
    <DataTable
      columns={columns}
      data={productKeys ?? []}
      handleAdd={async (newRow) => addProductKeys(newRow as ProductKeyType[])}
    />
  );
};

export default ProductKeysTable;
