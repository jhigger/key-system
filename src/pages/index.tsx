import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import { useRouter } from "next/navigation";
import RootLayout from "~/components/layouts/root-layout";
import Loader from "~/components/loader";
import ProductList from "~/components/product-list";
import { useUserStore } from "~/state/user.store";

export default function Home() {
  const { user: clerkUser, isLoaded } = useUser();
  const { user } = useUserStore();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <RootLayout>
        <Loader />
      </RootLayout>
    );
  }

  if (!clerkUser) {
    router.push("/login");
    return null;
  }

  // TODO: remove on production
  if (user?.role === "admin") {
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
