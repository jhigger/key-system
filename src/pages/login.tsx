import Head from "next/head";
import RootLayout from "~/components/layouts/root-layout";
import { LoginForm } from "~/components/login-form";

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
