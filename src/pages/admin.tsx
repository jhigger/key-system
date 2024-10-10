import Head from "next/head";
import { useRouter } from "next/router";
import AdminDashboard from "~/components/AdminDashboard";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import useTitle from "~/hooks/useTitle";
import { useUserStore } from "~/state/userStore";

const Admin = () => {
  const { user } = useUserStore();
  const title = useTitle();
  const { pathname, push } = useRouter();

  if (user !== null && user.role !== "admin" && pathname === "/admin") {
    push("/").catch(console.error);
    return null;
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <DefaultLayout>
        {user?.role === "admin" && <AdminDashboard />}
      </DefaultLayout>
    </>
  );
};

export default Admin;
