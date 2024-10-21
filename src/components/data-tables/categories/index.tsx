import { Loader } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import useCategories from "~/hooks/useCategories";
import CategoriesTable from "./table";

const Categories = () => {
  const {
    query: { data: categories, isLoading, isError },
  } = useCategories();

  if (isError) {
    return <div className="flex justify-center p-4">Error fetching data</div>;
  }

  return (
    <Card>
      {isLoading ? (
        <Loader className="p-4" />
      ) : (
        <>
          <CardHeader>
            <div className="flex justify-between gap-4">
              <div className="flex flex-col gap-y-1.5">
                <CardTitle>Categories</CardTitle>
                <CardDescription>A list of categories.</CardDescription>
              </div>
              <div className="flex flex-col items-end justify-between">
                <CardTitle>{categories?.length ?? 0}</CardTitle>
                <CardDescription>Total</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <CategoriesTable />
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default Categories;
