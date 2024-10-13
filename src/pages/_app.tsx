import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import "~/styles/globals.css";

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <div className={GeistSans.className}>
          <Component {...pageProps} />
          <Toaster richColors />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
