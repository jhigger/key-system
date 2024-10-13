import Link from "next/link";

const PleaseLoginToView = () => {
  return (
    <div>
      Please{" "}
      <Link href="/login" className="underline">
        login
      </Link>{" "}
      to view
    </div>
  );
};

export default PleaseLoginToView;
