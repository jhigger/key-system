import { useMemo } from "react";
import useProducts from "~/hooks/useProducts";
import { type ProductType } from "~/types/product";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";

const ProductsTable = () => {
  const {
    query: { data: products },
    mutation: { addProduct },
  } = useProducts();

  const columns = useMemo(() => getColumns(), []);

  return (
    <DataTable
      columns={columns}
      data={products ?? []}
      handleAdd={(newRow) => addProduct(newRow as ProductType)}
    />
  );
};

export default ProductsTable;
