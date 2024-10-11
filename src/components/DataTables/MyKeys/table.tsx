import { useCallback, useMemo, useState } from "react";
import { type PurchasedKeyType } from "~/types/purchasedKey";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";
import { keys } from "./keys";

const MyKeysTable = () => {
  const [data, setData] = useState<Partial<PurchasedKeyType>[]>(keys);

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
