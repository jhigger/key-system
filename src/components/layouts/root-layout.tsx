import { cn } from "~/lib/utils";
import Footer from "../footer";
import Header from "../header";
import GridPattern from "../ui/grid-pattern";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex h-full min-h-screen flex-col items-center bg-background text-foreground [&>*]:w-full">
      <Header />
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn("opacity-10")}
      />
      <main className="container z-10 mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
