import { type Table as TableType } from "@tanstack/react-table";
import { Ban, Eye, FilePenLine, PackagePlus, Search } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { fakeProducts } from "~/lib/fakeData";
import { useUIStore } from "~/state/ui.store";
import { useUserStore } from "~/state/user.store";
import { variants } from "~/types/pricing";
import { type ProductType } from "~/types/product";
import { type ProductKeyType } from "~/types/productKey";
import { roles } from "~/types/user";
import DatePicker from "./DatePicker";
import DebouncedInput from "./DebouncedInput";
import ProductForm, { type ProductFormRef } from "./ProductForm";
import ProductKeyForm, { type ProductKeyFormRef } from "./ProductKeyForm";
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
  handleAdd?: (newRow: ProductType | ProductKeyType) => void;
};

const DataTableToolBar = <TData,>({
  table,
  handleAdd,
}: DataTableToolBarProps<TData>) => {
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

  const { user } = useUserStore();
  const { editMode, toggleEditMode } = useUIStore();
  const { asPath } = useRouter();
  const [showForm, setShowForm] = useState(false);
  const isAdminPage = asPath === "/admin";
  const isProductsPage = isAdminPage || asPath === "/admin#products";
  const isProductKeysPage = asPath === "/admin#product-keys";
  const productFormRef = useRef<ProductFormRef>(null);
  const productKeyFormRef = useRef<ProductKeyFormRef>(null);

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
                        handleSubmit={(values) => {
                          setShowForm(false);
                          handleAdd?.(values);
                        }}
                      />
                    )}
                    {isProductKeysPage && (
                      <ProductKeyForm
                        ref={productKeyFormRef}
                        handleSubmit={(values) => {
                          setShowForm(false);
                          handleAdd?.(values);
                        }}
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
        {productColumn && (
          <DataTableFacetedFilter
            column={productColumn}
            title="Product"
            options={fakeProducts.map((product) => ({
              label:
                product.name.charAt(0).toUpperCase() + product.name.slice(1),
              value: product.name,
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
              label: variant,
              value: variant,
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

export default DataTableToolBar;
