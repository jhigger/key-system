import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export type TabType = {
  label: string;
  value: string;
  content: React.ReactNode;
  icon: React.ReactNode;
};

type TabLayoutProps = {
  tabs: TabType[];
};

const TabsLayout = ({ tabs }: TabLayoutProps) => {
  type TabValue = (typeof tabs)[number]["value"];
  const [activeTab, setActiveTab] = useState<TabValue>(tabs[0]?.value ?? "");
  const { asPath } = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hashId = asPath.split("#")[1];
      const newActiveTab =
        hashId && tabs.some((tab) => tab.value === hashId)
          ? hashId
          : (tabs[0]?.value ?? "");

      // Only update state if it's different from current state
      if (newActiveTab !== activeTab) {
        setActiveTab(newActiveTab);
      }
    }
  }, [asPath, tabs, activeTab]); // Added activeTab to dependencies

  return (
    <Tabs
      defaultValue={tabs[0]?.value}
      className="w-full max-w-screen-lg grow"
      value={activeTab}
    >
      <TabsList className="flex h-fit w-full flex-wrap">
        {tabs.map(({ label, value, icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="flex flex-1 items-center justify-center gap-2"
            asChild
          >
            <Link href={`#${value}`}>
              {icon} {label}
            </Link>
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
