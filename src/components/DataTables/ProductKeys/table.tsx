import { useCallback, useMemo, useState } from "react";
import { type ProductKeyType } from "~/types/productKey";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";
import { productKeys } from "./productKeys";

const ProductKeysTable = () => {
  const [data, setData] = useState<Partial<ProductKeyType>[]>(productKeys);

  const handleAdd = useCallback((newRow: Partial<ProductKeyType>) => {
    setData((prevData) => [...prevData, newRow]);
  }, []);

  const handleEdit = useCallback((productKey: Partial<ProductKeyType>) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.uuid === productKey.uuid ? { ...item, ...productKey } : item,
      ),
    );
  }, []);

  const handleDelete = useCallback((uuid: string) => {
    setData((prevData) => prevData.filter((item) => item.uuid !== uuid));
  }, []);

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [handleEdit, handleDelete],
  );

  return <DataTable columns={columns} data={data} handleAdd={handleAdd} />;
};

export default ProductKeysTable;
