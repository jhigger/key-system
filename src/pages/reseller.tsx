import { KeyRound, PackageSearch } from "lucide-react";
import Head from "next/head";
import ProductKeys from "~/components/data-tables/product-keys";
import Products from "~/components/data-tables/products";
import RootLayout from "~/components/layouts/root-layout";
import TabsLayout, { type TabType } from "~/components/layouts/tabs-layout";
import Loader from "~/components/loader";
import PleaseLoginToView from "~/components/please-login-to-view";
import { useCurrentUser } from "~/hooks/useCurrentUser";

export const RESELLER_TABS: (TabType & { icon: React.ReactNode })[] = [
  {
    label: "Products",
    value: "products",
    content: <Products />,
    icon: <PackageSearch size={16} />,
  },
  {
    label: "Product Keys",
    value: "product-keys",
    content: <ProductKeys />,
    icon: <KeyRound size={16} />,
  },
] as const;

const Reseller = () => {
  const { isLoading, user } = useCurrentUser();

  if (isLoading) {
    return (
      <RootLayout>
        <Loader />
      </RootLayout>
    );
  }

  if (!user) {
    return <PleaseLoginToView />;
  }

  return (
    <>
      <Head>
        <title>Reseller - CTX</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <RootLayout>
        <TabsLayout tabs={RESELLER_TABS} />
      </RootLayout>
    </>
  );
};

export default Reseller;
