import { type Table as TableType } from "@tanstack/react-table";
import { Ban, Eye, FilePenLine, PackagePlus, Search } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import useProducts from "~/hooks/useProducts";
import { formatDuration } from "~/lib/utils";
import { useUIStore } from "~/state/ui.store";
import { useUserStore } from "~/state/user.store";
import { type ProductType } from "~/types/product";
import { type ProductKeyType } from "~/types/productKey";
import { roles } from "~/types/user";
import DatePicker from "./date-picker";
import DebouncedInput from "./debounced-input";
import ProductForm, { type ProductFormRef } from "./product-form";
import ProductKeyForm, { type ProductKeyFormRef } from "./product-key-form";
import { Button } from "./ui/button";
import { DataTableFacetedFilter } from "./ui/data-table-faceted-filter";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

type DataTableToolBarProps<TData> = {
  table: TableType<TData>;
  handleAdd?: (newRow: ProductType | ProductKeyType[]) => Promise<void>;
};

const DataTableToolBar = <TData,>({
  table,
  handleAdd,
}: DataTableToolBarProps<TData>) => {
  const { user } = useUserStore();
  const { editMode, toggleEditMode } = useUIStore();
  const { asPath } = useRouter();
  const [showForm, setShowForm] = useState(false);
  const isAdminPage = asPath === "/admin";
  const isProductsPage =
    isAdminPage || asPath.split("?")[0] === "/admin#products";
  const isProductKeysPage = asPath.split("?")[0] === "/admin#product-keys";
  const productFormRef = useRef<ProductFormRef>(null);
  const productKeyFormRef = useRef<ProductKeyFormRef>(null);
  const {
    query: { data: products },
  } = useProducts();

  useEffect(() => {
    if (showForm) {
      setTimeout(() => {
        if (isProductsPage) {
          productFormRef.current?.focus();
        } else if (isProductKeysPage) {
          productKeyFormRef.current?.focus();
        }
      }, 100);
    }
  }, [showForm, isProductsPage, isProductKeysPage]);

  useEffect(() => {
    if (asPath === "/admin#products?openForm=true") {
      setShowForm(true);
    }
  }, [asPath]);

  const productColumn = table
    .getAllColumns()
    .find((column) => column.id === "product");
  const variantColumn = table
    .getAllColumns()
    .find((column) => column.id === "variant");
  const statusColumn = table
    .getAllColumns()
    .find((column) => column.id === "status");
  const roleColumn = table
    .getAllColumns()
    .find((column) => column.id === "role");
  const approvalColumn = table
    .getAllColumns()
    .find((column) => column.id === "approvedBy");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
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
        {user?.role === "admin" &&
          (isAdminPage || isProductsPage || isProductKeysPage) && (
            <Drawer open={showForm} onOpenChange={setShowForm}>
              <DrawerTrigger asChild>
                <Button variant={"outline"} size={"sm"} className="gap-2 px-2">
                  <PackagePlus size={20} /> Add
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
                  <div className="mx-auto w-full max-w-screen-sm">
                    <DrawerHeader>
                      <DrawerTitle>
                        Add a new {isProductsPage ? "product" : "product key"}
                      </DrawerTitle>
                      <DrawerDescription>
                        Click submit when you&apos;re done or cancel to discard
                        changes.
                      </DrawerDescription>
                    </DrawerHeader>
                    {isProductsPage && (
                      <ProductForm
                        ref={productFormRef}
                        handleSubmit={async (values) => {
                          await handleAdd?.(values).finally(() => {
                            setShowForm(false);
                          });
                        }}
                      />
                    )}
                    {isProductKeysPage && (
                      <ProductKeyForm
                        ref={productKeyFormRef}
                        handleSubmit={async (values) => {
                          await handleAdd?.(values).finally(() => {
                            setShowForm(false);
                          });
                        }}
                        setShowForm={setShowForm}
                      />
                    )}
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          )}
        {user?.role === "admin" && (
          <div className="flex items-center gap-2">
            <Label htmlFor="mode" className="sr-only capitalize">
              {editMode ? "Edit" : "View"} Mode
            </Label>
            <Switch
              id="mode"
              checked={editMode}
              onCheckedChange={toggleEditMode}
              icon={
                editMode ? (
                  <FilePenLine className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )
              }
            />
          </div>
        )}
      </div>
      <div className="flex w-full flex-wrap items-center gap-2">
        <DatePicker table={table} />
        {productColumn && products && (
          <DataTableFacetedFilter
            column={productColumn}
            title="Product"
            options={products.map((product) => ({
              label:
                product.name.charAt(0).toUpperCase() + product.name.slice(1),
              value: product.name,
            }))}
          />
        )}
        {variantColumn && (
          <DataTableFacetedFilter
            column={variantColumn}
            title="Variant"
            options={
              products?.reduce(
                (acc, product) => {
                  product.pricings?.forEach((pricing) => {
                    if (!acc.some((item) => item.value === pricing.duration)) {
                      acc.push({
                        label: formatDuration(pricing.duration),
                        value: pricing.duration,
                      });
                    }
                  });
                  return acc;
                },
                [] as { label: string; value: number }[],
              ) ?? []
            }
          />
        )}
        {statusColumn && (
          <DataTableFacetedFilter
            column={statusColumn}
            title="Status"
            options={[
              { label: "Active", value: "active" },
              { label: "Expired", value: "expired" },
            ]}
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
        {approvalColumn && (
          <DataTableFacetedFilter
            column={approvalColumn}
            title="Status"
            options={[
              { label: "Approved", value: "approved" },
              { label: "Pending", value: "pending" },
            ]}
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

export default DataTableToolBar;
