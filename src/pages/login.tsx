import Head from "next/head";
import RootLayout from "~/components/layouts/DefaultLayout";
import { LoginForm } from "~/components/LoginForm";

const Login = () => {
  return (
    <>
      <Head>
        <title>Login - CTX</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <RootLayout>
        <LoginForm />
      </RootLayout>
    </>
  );
};

export default Login;
