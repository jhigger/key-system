import { Folder, History, KeyRound, PackageSearch } from "lucide-react";
import Head from "next/head";
import Categories from "~/components/data-tables/categories";
import MyKeys from "~/components/data-tables/my-key";
import OrderHistory from "~/components/data-tables/order-history";
import Products from "~/components/data-tables/products";
import RootLayout from "~/components/layouts/root-layout";
import TabsLayout, { type TabType } from "~/components/layouts/tabs-layout";
import Loader from "~/components/loader";
import PleaseLoginToView from "~/components/please-login-to-view";
import { useCurrentUser } from "~/hooks/useCurrentUser";

export const RESELLER_TABS: (TabType & { icon: React.ReactNode })[] = [
  {
    label: "My Keys",
    value: "my-keys",
    content: <MyKeys />,
    icon: <KeyRound size={16} />,
  },
  {
    label: "Order History",
    value: "order-history",
    content: <OrderHistory />,
    icon: <History size={16} />,
  },
  {
    label: "Categories",
    value: "categories",
    content: <Categories />,
    icon: <Folder size={16} />,
  },
  {
    label: "Products",
    value: "products",
    content: <Products />,
    icon: <PackageSearch size={16} />,
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
    return (
      <RootLayout>
        <PleaseLoginToView />
      </RootLayout>
    );
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
