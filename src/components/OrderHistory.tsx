import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { products } from "~/types/product";
import { variants } from "~/types/variant";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const headers = [
  "Date Purchased",
  "Product",
  "Invoice Link",
  "Variant",
] as const;

const invoices: Record<(typeof headers)[number], string | undefined | null>[] =
  [
    {
      "Date Purchased": new Date(2024, 10 - 1, 9).toLocaleDateString(),
      Product: products[0]?.name,
      "Invoice Link": uuidv4(),
      Variant: variants[3]?.name,
    },
    {
      "Date Purchased": new Date(2024, 10 - 1, 8).toLocaleDateString(),
      Product: products[0]?.name,
      "Invoice Link": uuidv4(),
      Variant: variants[1]?.name,
    },
    {
      "Date Purchased": new Date(2024, 10 - 1, 7).toLocaleDateString(),
      Product: products[1]?.name,
      "Invoice Link": uuidv4(),
      Variant: variants[0]?.name,
    },
    {
      "Date Purchased": new Date(2024, 10 - 1, 6).toLocaleDateString(),
      Product: products[1]?.name,
      "Invoice Link": uuidv4(),
      Variant: variants[0]?.name,
    },
    {
      "Date Purchased": new Date(2024, 10 - 1, 5).toLocaleDateString(),
      Product: products[0]?.name,
      "Invoice Link": uuidv4(),
      Variant: variants[4]?.name,
    },
    {
      "Date Purchased": new Date(2024, 10 - 1, 4).toLocaleDateString(),
      Product: products[1]?.name,
      "Invoice Link": uuidv4(),
      Variant: variants[3]?.name,
    },
    {
      "Date Purchased": new Date(2024, 10 - 1, 3).toLocaleDateString(),
      Product: products[0]?.name,
      "Invoice Link": uuidv4(),
      Variant: variants[2]?.name,
    },
  ];

const OrderHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>A list of your recent transactions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">
                  {invoice["Date Purchased"]}
                </TableCell>
                <TableCell>{invoice.Product}</TableCell>
                <TableCell>{invoice["Invoice Link"]}</TableCell>
                <TableCell>{invoice.Variant}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrderHistory;
