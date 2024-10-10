import { DataTable } from "../ui/data-table";
import { columns } from "./columns";
import { products } from "./products";

const ProductsTable = () => {
  return <DataTable columns={columns} data={products} />;
};

export default ProductsTable;
