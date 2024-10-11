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
  type Table as TableType,
  useReactTable,
} from "@tanstack/react-table";
import {
  Ban,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { fakeProducts } from "~/lib/fakeData";
import { cn } from "~/lib/utils";
import { roles } from "~/types/user";
import { variants } from "~/types/variant";
import DatePicker from "../DatePicker";
import DebouncedInput from "../DebouncedInput";
import { Button } from "./button";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
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

  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <>
      <DataTableToolBar table={table} />
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

type ToolBarProps<TData> = {
  table: TableType<TData>;
};

const DataTableToolBar = <TData,>({ table }: ToolBarProps<TData>) => {
  const productColumn = table
    .getAllColumns()
    .find((column) => column.id === "product");
  const statusColumn = table
    .getAllColumns()
    .find((column) => column.id === "status");
  const variantColumn = table
    .getAllColumns()
    .find((column) => column.id === "variant");
  const roleColumn = table
    .getAllColumns()
    .find((column) => column.id === "role");

  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-full">
        <Label htmlFor="search">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
        </Label>
        <DebouncedInput
          id="search"
          type="search"
          placeholder="Search..."
          value={table.getState().globalFilter as string}
          onChange={(value) => table.setGlobalFilter(String(value))}
          className="h-8 max-w-sm pl-8"
        />
      </div>
      <div className="flex w-full flex-wrap items-center gap-2">
        <DatePicker table={table} />
        {productColumn && (
          <DataTableFacetedFilter
            column={productColumn}
            title="Product"
            options={fakeProducts.map((product) => ({
              label:
                product.product.charAt(0).toUpperCase() +
                product.product.slice(1),
              value: product.product,
            }))}
          />
        )}
        {statusColumn && (
          <DataTableFacetedFilter
            column={statusColumn}
            title="Status"
            options={[
              { label: "Active", value: "Active" },
              { label: "Expired", value: "Expired" },
            ]}
          />
        )}
        {variantColumn && (
          <DataTableFacetedFilter
            column={variantColumn}
            title="Variant"
            options={variants.map((variant) => ({
              label: variant.name,
              value: variant.name,
            }))}
          />
        )}
        {roleColumn && (
          <DataTableFacetedFilter
            column={roleColumn}
            title="Role"
            options={roles.map((role) => ({
              label: role,
              value: role,
            }))}
          />
        )}
        {table.getState().columnFilters.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            className="h-8 border-dashed"
            onClick={() => table.resetColumnFilters()}
          >
            <Ban className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
};

interface DataTablePaginationProps<TData> {
  table: TableType<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex w-full items-center space-x-6 lg:space-x-8">
        <div className="flex w-full items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex shrink-0 items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
