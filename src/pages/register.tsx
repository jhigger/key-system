import Head from "next/head";
import RootLayout from "~/components/layouts/root-layout";
import { RegisterForm } from "~/components/register-form";

const Register = () => {
  return (
    <>
      <Head>
        <title>Register - CTX</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <RootLayout>
        <RegisterForm />
      </RootLayout>
    </>
  );
};

export default Register;
