import Head from "next/head";
import { useRouter } from "next/navigation";
import RootLayout from "~/components/layouts/root-layout";
import Loader from "~/components/loader";
import ProductList from "~/components/product-list";
import { useUserStore } from "~/state/user.store";

export default function Home() {
  const { user } = useUserStore();
  const router = useRouter();

  if (!user) {
    return null;
  }

  if (user.role === "admin") {
    router.push("/admin");
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
