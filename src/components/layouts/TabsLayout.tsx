import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useEffect, useState } from "react";
import PleaseLoginToView from "../PleaseLoginToView";
import { useUserStore } from "~/state/user.store";
import { useRouter } from "next/router";

export type TabType = {
  label: string;
  value: string;
  content: React.ReactNode;
};

type TabLayoutProps = {
  path: string;
  tabs: TabType[];
};

const TabsLayout = ({ path, tabs }: TabLayoutProps) => {
  type TabValue = (typeof tabs)[number]["value"];
  const [activeTab, setActiveTab] = useState<TabValue>(tabs[0]?.value ?? "");
  const { user } = useUserStore();
  const { asPath } = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hashId = asPath.split("#")[1];
      setActiveTab(
        hashId && tabs.some((tab) => tab.value === hashId)
          ? hashId
          : (tabs[0]?.value ?? ""),
      );
    }
  }, [asPath, tabs]);

  if (!user) {
    return <PleaseLoginToView />;
  }

  return (
    <Tabs
      defaultValue={tabs[0]?.value}
      className="w-full max-w-screen-lg grow"
      value={activeTab}
    >
      <TabsList className="grid w-full grid-cols-2">
        {tabs.map(({ label, value }) => (
          <TabsTrigger key={value} value={value} asChild>
            <Link href={`${path}#${value}`}>{label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(({ value, content }) => (
        <TabsContent key={value} value={value}>
          {content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabsLayout;
