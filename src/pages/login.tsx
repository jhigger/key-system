import Head from "next/head";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import { LoginForm } from "~/components/LoginForm";

const Login = () => {
  return (
    <>
      <Head>
        <title>Login - Key System</title>
        <meta name="description" content="Made by Kairos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DefaultLayout>
        <LoginForm />
      </DefaultLayout>
    </>
  );
};

export default Login;
