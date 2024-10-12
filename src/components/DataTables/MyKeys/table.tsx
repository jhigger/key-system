import { useCallback, useMemo, useState } from "react";
import { type ProductKeyType } from "~/types/productKey";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";
import { keys } from "./keys";

const MyKeysTable = () => {
  const [data, setData] = useState<Partial<ProductKeyType>[]>(keys);

  const handleDelete = useCallback((hardwareId?: string | null) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.hardwareId === hardwareId ? { ...item, hardwareId: null } : item,
      ),
    );
  }, []);

  const columns = useMemo(
    () => getColumns({ onDelete: handleDelete }),
    [handleDelete],
  );

  return <DataTable columns={columns} data={data} />;
};

export default MyKeysTable;
