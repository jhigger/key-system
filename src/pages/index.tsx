import Head from "next/head";
import RootLayout from "~/components/layouts/root-layout";
import Loader from "~/components/loader";
import ProductList from "~/components/product-list";
import { useCurrentUser } from "~/hooks/useCurrentUser";

export default function Home() {
  const { isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <RootLayout>
        <Loader />
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
