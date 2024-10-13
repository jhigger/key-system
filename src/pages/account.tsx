import { History, KeyRound } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import MyKeys from "~/components/data-tables/my-key";
import OrderHistory from "~/components/data-tables/order-history";
import RootLayout from "~/components/layouts/root-layout";
import TabsLayout, { type TabType } from "~/components/layouts/tabs-layout";
import { useUserStore } from "~/state/user.store";

const PATH = "/account";

export const ACCOUNT_TABS: TabType[] = [
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
] as const;

const Account = () => {
  const { user } = useUserStore();
  const { pathname, push } = useRouter();

  if (user !== null && user.role === "admin" && pathname === "/account") {
    push("/admin").catch(console.error);
    return null;
  }

  return (
    <>
      <Head>
        <title>Account - CTX</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <RootLayout>
        {user?.role !== "admin" && (
          <TabsLayout path={PATH} tabs={ACCOUNT_TABS} />
        )}
      </RootLayout>
    </>
  );
};

export default Account;
