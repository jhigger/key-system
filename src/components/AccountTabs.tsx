import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MyKeys from "~/components/MyKeys";
import OrderHistory from "~/components/OrderHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useUserStore } from "~/state/userStore";
import PleaseLoginToView from "./PleaseLoginToView";

const path = "/account";

const tabs = [
  { label: "My Keys", value: "my-keys", content: <MyKeys /> },
  { label: "Order History", value: "order-history", content: <OrderHistory /> },
] as const;

const AccountTabs = () => {
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

  if (!user) {
    return <PleaseLoginToView />;
  }

  return (
    <Tabs
      defaultValue={tabs[0].value}
      className="w-full max-w-screen-md"
      value={id}
    >
      <TabsList className="grid w-full grid-cols-2">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} asChild>
            <Link href={`${path}#${tab.value}`}>{tab.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default AccountTabs;
