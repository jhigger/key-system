import Head from "next/head";
import RootLayout from "~/components/layouts/DefaultLayout";
import { RegisterForm } from "~/components/RegisterForm";

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
