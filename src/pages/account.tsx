import { History, KeyRound } from "lucide-react";
import Head from "next/head";
import MyKeys from "~/components/data-tables/my-key";
import OrderHistory from "~/components/data-tables/order-history";
import RootLayout from "~/components/layouts/root-layout";
import TabsLayout, { type TabType } from "~/components/layouts/tabs-layout";
import Loader from "~/components/loader";
import { useCurrentUser } from "~/hooks/useCurrentUser";

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
        <title>Account - CTX</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <RootLayout>
        <TabsLayout tabs={ACCOUNT_TABS} />
      </RootLayout>
    </>
  );
};

export default Account;
