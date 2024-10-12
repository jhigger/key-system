import Head from "next/head";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import { LoginForm } from "~/components/LoginForm";

const Login = () => {
  return (
    <>
      <Head>
        <title>Login - CTX</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <DefaultLayout>
        <LoginForm />
      </DefaultLayout>
    </>
  );
};

export default Login;
