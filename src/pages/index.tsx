import Head from "next/head";
import Link from "next/link";
import RootLayout from "~/components/layouts/root-layout";
import Loader from "~/components/loader";
import ProductList from "~/components/product-list";
import { Button } from "~/components/ui/button";
import { useCurrentUser } from "~/hooks/useCurrentUser";

export default function Home() {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <RootLayout>
        <Loader />
      </RootLayout>
    );
  }

  if (user?.role !== "user" && user?.role !== undefined) {
    return (
      <RootLayout>
        <Button variant={"link"} className="underline" asChild>
          <Link href={user?.role === "admin" ? "/admin" : "/reseller"}>
            Go to tables
          </Link>
        </Button>
      </RootLayout>
    );
  }

  return (
    <>
      <Head>
        <title>CTX</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <RootLayout>
        <ProductList />
      </RootLayout>
    </>
  );
}
