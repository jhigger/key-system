import { useMemo } from "react";
import useCategories from "~/hooks/useCategories";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { type CategoryType } from "~/types/category";
import { DataTable } from "../../ui/data-table";
import { getColumns } from "./columns";

const CategoriesTable = () => {
  const {
    query: { data: categories },
    mutation: { addCategory },
  } = useCategories();
  const { user } = useCurrentUser();

  const columns = useMemo(() => {
    if (!user) return null;
    return user.role !== "admin"
      ? getColumns().slice(0, getColumns().length - 1)
      : getColumns();
  }, [user]);

  if (!columns) return null;

  return (
    <DataTable
      columns={columns}
      data={categories ?? []}
      handleAdd={async (newRow) => addCategory(newRow as CategoryType)}
    />
  );
};

export default CategoriesTable;
