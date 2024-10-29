import { type RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { useUIStore } from "~/state/ui.store";
import { type CategoryType } from "~/types/category";
import { type ProductType } from "~/types/product";
import { type ProductKeyType } from "~/types/productKey";
import DataTablePagination from "../data-table-pagination";
import DataTableToolBar from "../data-table-tool-bar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  handleAdd?: (
    newRow: ProductType | ProductKeyType[] | CategoryType,
  ) => Promise<void>;
}

declare module "@tanstack/react-table" {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<unknown> = (
  row,
  columnId,
  filterValue,
  addMeta,
) => {
  // If the filter value is an array (multiple selections), apply "OR" logic
  if (Array.isArray(filterValue)) {
    return filterValue.some(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      (value) => rankItem(row.getValue(columnId), value).passed,
    );
  }
  // Default behavior for single value
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const itemRank = rankItem(row.getValue(columnId), filterValue);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

const isAccessorColumn = <TData, TValue>(
  column: ColumnDef<TData, TValue>,
): column is { accessorKey: string } & ColumnDef<TData, TValue> => {
  return "accessorKey" in column;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  handleAdd,
}: DataTableProps<TData, TValue>) {
  const expiryColumn = columns.find(
    (column) => isAccessorColumn(column) && column.accessorKey === "expiry",
  );

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: expiryColumn ? "expiry" : "createdAt",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const { pageSize, setPageSize } = useUIStore();
  const router = useRouter();

  useEffect(() => {
    setPageIndex(0);
  }, [router.asPath, globalFilter]);

  const pagination = {
    pageIndex,
    pageSize,
  };

  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater(pagination);
        setPageIndex(newPagination.pageIndex);
        setPageSize(newPagination.pageSize);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    autoResetPageIndex: false,
    globalFilterFn: "fuzzy",
  });

  return (
    <>
      <DataTableToolBar table={table} handleAdd={handleAdd} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(cell.column.getCanSort() && "pl-4")}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </>
  );
}
