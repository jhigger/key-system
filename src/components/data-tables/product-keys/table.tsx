import { useMemo } from "react";
import useProductKeys from "~/hooks/useProductKeys";
import useProducts from "~/hooks/useProducts";
import { type ProductKeyType } from "~/types/productKey";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";

const ProductKeysTable = () => {
  const {
    query: { data: productKeys },
    mutation: { addProductKey },
  } = useProductKeys();
  const {
    query: { data: products },
  } = useProducts();

  const columns = useMemo(() => getColumns({ products }), [products]);

  return (
    <DataTable
      columns={columns}
      data={productKeys ?? []}
      handleAdd={async (newRow) => addProductKey(newRow as ProductKeyType)}
    />
  );
};

export default ProductKeysTable;
