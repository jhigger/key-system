import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUserStore } from "~/state/user.store";
import Products from "./DataTables/Products";
import Users from "./DataTables/Users";
import PleaseLoginToView from "./PleaseLoginToView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const path = "/admin";

const tabs = [
  { label: "Products", value: "products", content: <Products /> },
  { label: "Users", value: "users", content: <Users /> },
] as const;

const AdminDashboard = () => {
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
      className="w-full max-w-screen-lg grow"
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

export default AdminDashboard;
