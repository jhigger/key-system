import Head from "next/head";
import { useRouter } from "next/router";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import ProductList from "~/components/ProductList";
import { TITLE } from "~/constants";
import { useUserStore } from "~/state/user.store";

export default function Home() {
  const { user } = useUserStore();
  const { pathname, push } = useRouter();

  if (user !== null && user.role === "admin" && pathname === "/") {
    push("/admin").catch(console.error);
    return null;
  }

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <DefaultLayout>
        <ProductList />
      </DefaultLayout>
    </>
  );
}
