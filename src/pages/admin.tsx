import {
  Folder,
  KeyRound,
  PackageSearch,
  UserSearch,
  Wrench,
} from "lucide-react";
import Head from "next/head";
import AdminOptions from "~/components/admin-options";
import Categories from "~/components/data-tables/categories";
import ProductKeys from "~/components/data-tables/product-keys";
import Products from "~/components/data-tables/products";
import Users from "~/components/data-tables/users";
import RootLayout from "~/components/layouts/root-layout";
import TabsLayout, { type TabType } from "~/components/layouts/tabs-layout";
import Loader from "~/components/loader";
import PleaseLoginToView from "~/components/please-login-to-view";
import { useCurrentUser } from "~/hooks/useCurrentUser";

export const ADMIN_TABS: (TabType & { icon: React.ReactNode })[] = [
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
  {
    label: "Options",
    value: "option",
    content: <AdminOptions />,
    icon: <Wrench size={16} />,
  },
] as const;

const Admin = () => {
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
