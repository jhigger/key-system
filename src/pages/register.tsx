import Head from "next/head";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import { RegisterForm } from "~/components/RegisterForm";

const Register = () => {
  return (
    <>
      <Head>
        <title>Register - CTX</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <DefaultLayout>
        <RegisterForm />
      </DefaultLayout>
    </>
  );
};

export default Register;
