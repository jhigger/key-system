import Head from "next/head";
import Link from "next/link";
import RootLayout from "~/components/layouts/root-layout";
import ProductList from "~/components/product-list";
import { Button } from "~/components/ui/button";
import { useUserStore } from "~/state/user.store";

export default function Home() {
  const { user } = useUserStore();
  return (
    <>
      <Head>
        <title>CTX</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <RootLayout>
        {user?.role === "admin" ? (
          <Button variant="link" className="underline">
            <Link href="/admin">Go to admin page</Link>
          </Button>
        ) : (
          <ProductList />
        )}
      </RootLayout>
    </>
  );
}
