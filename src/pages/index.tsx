import Head from "next/head";
import RootLayout from "~/components/layouts/root-layout";
import ProductList from "~/components/product-list";

export default function Home() {
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
