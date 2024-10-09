import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import MyKeys from "~/components/MyKeys";
import OrderHistory from "~/components/OrderHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useUserStore } from "~/state/userStore";

const tabs = [
  { label: "My Keys", value: "my-keys", content: <MyKeys /> },
  { label: "Order History", value: "order-history", content: <OrderHistory /> },
] as const;

const Account = () => {
  const { user } = useUserStore();
  const { asPath } = useRouter();
  const [id, setId] = useState<(typeof tabs)[number]["value"]>(tabs[0].value);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hashId = asPath.split("#")[1];
      const tab = tabs.find((tab) => tab.value === hashId);
      setId(tab ? tab.value : tabs[0].value);
    }
  }, [asPath]);

  return (
    <>
      <Head>
        <title>Account - Reseller Panel</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <DefaultLayout>
        {user ? (
          <Tabs
            defaultValue="my-keys"
            className="w-full max-w-screen-md"
            value={id}
          >
            <TabsList className="grid w-full grid-cols-2">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} asChild>
                  <Link href={`/account#${tab.value}`}>{tab.label}</Link>
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div>
            Please{" "}
            <Link href="/login" className="underline">
              login
            </Link>{" "}
            to view
          </div>
        )}
      </DefaultLayout>
    </>
  );
};

export default Account;
