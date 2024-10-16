import { useUser } from "@clerk/nextjs";
import { History, KeyRound } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import MyKeys from "~/components/data-tables/my-key";
import OrderHistory from "~/components/data-tables/order-history";
import RootLayout from "~/components/layouts/root-layout";
import TabsLayout, { type TabType } from "~/components/layouts/tabs-layout";
import Loader from "~/components/loader";
import { useUserStore } from "~/state/user.store";

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
