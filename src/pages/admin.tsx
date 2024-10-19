import { KeyRound, PackageSearch, UserSearch } from "lucide-react";
import Head from "next/head";
import ProductKeys from "~/components/data-tables/product-keys";
import Products from "~/components/data-tables/products";
import Users from "~/components/data-tables/users";
import RootLayout from "~/components/layouts/root-layout";
import TabsLayout, { type TabType } from "~/components/layouts/tabs-layout";
import Loader from "~/components/loader";
import { useCurrentUser } from "~/hooks/useCurrentUser";

export const ADMIN_TABS: (TabType & { icon: React.ReactNode })[] = [
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
  {
    label: "Users",
    value: "users",
    content: <Users />,
    icon: <UserSearch size={16} />,
  },
] as const;

const Admin = () => {
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
        <title>Admin - CTX</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <RootLayout>
        <TabsLayout tabs={ADMIN_TABS} />
      </RootLayout>
    </>
  );
};

export default Admin;
