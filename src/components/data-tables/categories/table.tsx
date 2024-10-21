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

  const columns = useMemo(() => getColumns(), []);

  if (!user) return null;

  return (
    <DataTable
      columns={
        user.role !== "admin" ? columns.slice(0, columns.length - 1) : columns
      }
      data={categories ?? []}
      handleAdd={async (newRow) => addCategory(newRow as CategoryType)}
    />
  );
};

export default CategoriesTable;
