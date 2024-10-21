import { type ColumnDef, type Row } from "@tanstack/react-table";
import { Menu, Trash2 } from "lucide-react";
import DebouncedInput from "~/components/debounced-input";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import useCategories from "~/hooks/useCategories";
import useProducts from "~/hooks/useProducts";
import { dateFilterFn, formatISOStringToDate } from "~/lib/utils";
import { useUIStore } from "~/state/ui.store";
import { type CategoryType } from "~/types/category";
import { DataTableColumnHeader } from "../../data-table-column-header";

const CategoryNameCell: React.FC<{
  row: Row<CategoryType>;
}> = ({ row }) => {
  const { editMode } = useUIStore();
  const {
    mutation: { editCategoryName },
  } = useCategories();

  if (editMode) {
    return (
      <DebouncedInput
        type="text"
        value={row.original.name}
        onChange={(value) => editCategoryName({ ...row.original, name: value })}
        className="w-full max-w-[200px]"
      />
    );
  }

  return <div className="capitalize">{row.original.name}</div>;
};

const CategoryActionsCell: React.FC<{
  row: Row<CategoryType>;
}> = ({ row }) => {
  const { editMode } = useUIStore();
  const {
    mutation: { deleteCategory },
  } = useCategories();

  if (editMode) {
    return (
      <div className="-ml-4 flex flex-col whitespace-nowrap">
        <div
          key={row.original.uuid}
          className="border-b py-2 pl-4 transition-colors last:border-b-0"
        >
          <Button
            variant="destructive"
            onClick={() => deleteCategory(row.original.uuid)}
            className="gap-2"
          >
            Delete <Trash2 size={16} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="gap-2">
          <Menu size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="flex w-full justify-between gap-4 leading-normal"
          asChild
        >
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={() => deleteCategory(row.original.uuid)}
          >
            Delete <Trash2 size={16} />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const CategoryProductsCell: React.FC<{
  row: Row<CategoryType>;
}> = ({ row }) => {
  const {
    query: { data: products },
  } = useProducts();

  return products?.filter((product) => product.category === row.original.uuid)
    .length;
};

export const getColumns = (): ColumnDef<CategoryType>[] => [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Joined" />
    ),
    cell: ({ row }) => {
      const { createdAt } = row.original;

      if (!createdAt) return null;

      const { formattedDate, formattedTime } = formatISOStringToDate(createdAt);
      return (
        <div className="flex flex-col gap-1 font-mono">
          <span>{formattedDate}</span>
          <span>{formattedTime}</span>
        </div>
      );
    },
    filterFn: dateFilterFn,
  },
  {
    id: "dateGlobalFilter",
    header: () => null,
    cell: () => null,
    accessorFn: (row) =>
      formatISOStringToDate(row.createdAt).formattedDate +
      " " +
      formatISOStringToDate(row.createdAt).formattedTime,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <CategoryNameCell row={row} />,
  },
  {
    id: "products",
    header: "Products",
    cell: ({ row }) => <CategoryProductsCell row={row} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CategoryActionsCell row={row} />,
  },
];
