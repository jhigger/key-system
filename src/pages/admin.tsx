import Head from "next/head";
import { useRouter } from "next/router";
import AdminDashboard from "~/components/AdminTabs";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import { TITLE } from "~/constants";
import { useUserStore } from "~/state/user.store";

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
        <title>{TITLE}</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <DefaultLayout>
        {user?.role === "admin" && <AdminDashboard />}
      </DefaultLayout>
    </>
  );
};

export default Admin;
