import Head from "next/head";
import Link from "next/link";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import ProductList from "~/components/ProductList";
import { useUserStore } from "~/state/userStore";

export default function Home() {
  const { user } = useUserStore();

  return (
    <>
      <Head>
        <title>Key System</title>
        <meta name="description" content="Made by Kairos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DefaultLayout>
        {user ? (
          <ProductList />
        ) : (
          <div>
            Please{" "}
            <Link href="/login" className="underline">
              login
            </Link>{" "}
            to view
          </div>
        )}
      </DefaultLayout>
    </>
  );
}
