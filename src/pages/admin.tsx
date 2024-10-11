import { PackageSearch, UserSearch } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import Products from "~/components/DataTables/Products";
import Users from "~/components/DataTables/Users";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import TabsLayout, { type TabType } from "~/components/layouts/TabsLayout";
import { TITLE } from "~/constants";
import { useUserStore } from "~/state/user.store";

const PATH = "/admin";

export const ADMIN_TABS: (TabType & { icon: React.ReactNode })[] = [
  {
    label: "Products",
    value: "products",
    content: <Products />,
    icon: <PackageSearch size={16} />,
  },
  {
    label: "Users",
    value: "users",
    content: <Users />,
    icon: <UserSearch size={16} />,
  },
] as const;

const Admin = () => {
  const { user } = useUserStore();
  const { pathname, push } = useRouter();

  if (user !== null && user.role !== "admin" && pathname === "/admin") {
    push("/").catch(console.error);
    return null;
  }

  return (
    <>
      <Head>
        <title>Admin - {TITLE}</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <DefaultLayout>
        {user?.role === "admin" && <TabsLayout path={PATH} tabs={ADMIN_TABS} />}
      </DefaultLayout>
    </>
  );
};

export default Admin;
