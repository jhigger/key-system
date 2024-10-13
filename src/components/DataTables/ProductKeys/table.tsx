import { useMemo } from "react";
import useProductKeys from "~/hooks/useProductKeys";
import { type ProductKeyType } from "~/types/productKey";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";

const ProductKeysTable = () => {
  const {
    query: { data: productKeys },
    mutation: { addProductKey, editProductKey, deleteProductKey },
  } = useProductKeys();

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: editProductKey,
        onDelete: deleteProductKey,
      }),
    [editProductKey, deleteProductKey],
  );

  return (
    <DataTable
      columns={columns}
      data={productKeys ?? []}
      handleAdd={(newRow) => addProductKey(newRow as ProductKeyType)}
    />
  );
};

export default ProductKeysTable;
