import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { ThemeProvider } from "~/components/ThemeProvider";
import { Toaster } from "~/components/ui/sonner";
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className={GeistSans.className}>
        <Component {...pageProps} />
        <Toaster richColors />
      </div>
    </ThemeProvider>
  );
};

export default MyApp;
