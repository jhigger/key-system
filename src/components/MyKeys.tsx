import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { products } from "~/types/product";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const headers = ["Product", "Key", "Expiry"] as const;

const invoices: Record<(typeof headers)[number], string | undefined | null>[] =
  [
    {
      Product: products[0]?.name,
      Key: uuidv4(),
      Expiry: new Date(2024, 10 - 1, 9 + 30).toLocaleDateString(),
    },
    {
      Product: products[0]?.name,
      Key: uuidv4(),
      Expiry: new Date(2024, 10 - 1, 8 + 3).toLocaleDateString(),
    },
    {
      Product: products[1]?.name,
      Key: uuidv4(),
      Expiry: new Date(2024, 10 - 1, 7 + 1).toLocaleDateString(),
    },
    {
      Product: products[1]?.name,
      Key: uuidv4(),
      Expiry: new Date(2024, 10 - 1, 6 + 1).toLocaleDateString(),
    },
    {
      Product: products[0]?.name,
      Key: uuidv4(),
      Expiry: null,
    },
    {
      Product: products[1]?.name,
      Key: uuidv4(),
      Expiry: new Date(2024, 10 - 1, 4 + 30).toLocaleDateString(),
    },
    {
      Product: products[0]?.name,
      Key: uuidv4(),
      Expiry: new Date(2024, 10 - 1, 3 + 7).toLocaleDateString(),
    },
  ];

const MyKeys = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Keys</CardTitle>
        <CardDescription>Keys you have purchased.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.Key}>
                <TableCell className="font-medium">{invoice.Product}</TableCell>
                <TableCell>{invoice.Key}</TableCell>
                <TableCell>{invoice.Expiry ?? "No Expiry"}</TableCell>
                <TableCell>
                  {invoice.Expiry !== null &&
                  invoice.Expiry !== undefined &&
                  new Date() >= new Date(invoice.Expiry) ? (
                    <Badge
                      variant="destructive"
                      className="w-full justify-center p-0"
                    >
                      Expired
                    </Badge>
                  ) : (
                    <Badge className="w-full justify-center bg-green-500/80 p-0 text-white">
                      Active
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MyKeys;
