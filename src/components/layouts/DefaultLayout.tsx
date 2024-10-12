import Footer from "../Footer";
import Header from "../Header";

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <div className="flex h-full min-h-screen flex-col items-center bg-background text-foreground [&>*]:w-full">
      <Header />
      <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
