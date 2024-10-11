import Head from "next/head";
import { useRouter } from "next/router";
import AccountTabs from "~/components/AccountTabs";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import useTitle from "~/hooks/useTitle";
import { useUserStore } from "~/state/user.store";

const Account = () => {
  const title = useTitle();
  const { user } = useUserStore();
  const { pathname, push } = useRouter();

  if (user !== null && user.role === "admin" && pathname === "/account") {
    push("/admin").catch(console.error);
    return null;
  }

  return (
    <>
      <Head>
        <title>Account - {title}</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <DefaultLayout>{user?.role !== "admin" && <AccountTabs />}</DefaultLayout>
    </>
  );
};

export default Account;
