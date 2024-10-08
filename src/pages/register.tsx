import Head from "next/head";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import { RegisterForm } from "~/components/RegisterForm";

const Register = () => {
  return (
    <>
      <Head>
        <title>Login - Key System</title>
        <meta name="description" content="Made by Kairos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DefaultLayout>
        <RegisterForm />
      </DefaultLayout>
    </>
  );
};

export default Register;
