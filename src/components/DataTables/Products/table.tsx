import { useCallback, useMemo, useState } from "react";
import { type ProductType } from "~/types/product";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";
import { products } from "./products";

const ProductsTable = () => {
  const [data, setData] = useState<Partial<ProductType>[]>(products);

  const handleAdd = useCallback((newRow: Partial<ProductType>) => {
    setData((prevData) => [...prevData, newRow]);
  }, []);

  const handleEdit = useCallback((product: Partial<ProductType>) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.uuid === product.uuid ? { ...item, ...product } : item,
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

export default ProductsTable;
