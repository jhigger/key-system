import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { CircleUser, LogOut, Moon, Store, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ACCOUNT_TABS } from "~/pages/account";
import { ADMIN_TABS } from "~/pages/admin";
import { RESELLER_TABS } from "~/pages/reseller";
import { useUserStore } from "~/state/user.store";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const BREAKPOINT = 768; // Adjust this breakpoint as needed

const NavigationItems = () => {
  const queryClient = useQueryClient();
  const { user: clerkUser, signOut } = useClerk();
  const { user, logout } = useUserStore();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { pathname } = useRouter();

  const handleThemeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    if (!clerkUser) {
      return;
    }
    await signOut({ redirectUrl: "/login" });
    await queryClient.invalidateQueries({
      queryKey: ["user", clerkUser.id],
    });
    logout();
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < BREAKPOINT);
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return (
    <>
      <SignedOut>
        <Button variant={"outline"} asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Register</Link>
        </Button>
      </SignedOut>
      <SignedIn>
        <Button
          variant={pathname === "/" ? "secondary" : "ghost"}
          className="gap-2"
          asChild
        >
          <Link href="/">
            Buy <Store size={16} />
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={
                ["/account", "/admin", "/reseller"].includes(pathname)
                  ? "secondary"
                  : "ghost"
              }
              className="gap-2"
            >
              Account <CircleUser size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isSmallScreen ? "center" : "end"}>
            <DropdownMenuLabel className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap md:max-w-full">
              {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user?.role === "admin" ? (
              <>
                {ADMIN_TABS.map((tab) => (
                  <DropdownMenuItem
                    key={tab.value}
                    className="flex justify-between gap-4"
                    asChild
                  >
                    <Link href={`/admin#${tab.value}`}>
                      {tab.label} {tab.icon}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </>
            ) : user?.role === "reseller" ? (
              <>
                {RESELLER_TABS.map((tab) => (
                  <DropdownMenuItem
                    key={tab.value}
                    className="flex justify-between gap-4"
                    asChild
                  >
                    <Link href={`/reseller#${tab.value}`}>
                      {tab.label} {tab.icon}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </>
            ) : (
              <>
                {user?.approvedBy &&
                  ACCOUNT_TABS.map((tab) => (
                    <DropdownMenuItem
                      key={tab.value}
                      className="flex justify-between gap-4"
                      asChild
                    >
                      <Link href={`/account#${tab.value}`}>
                        {tab.label} {tab.icon}
                      </Link>
                    </DropdownMenuItem>
                  ))}
              </>
            )}
            <DropdownMenuItem
              className="flex justify-between gap-4"
              onClick={handleThemeChange}
            >
              Toggle Theme{" "}
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex justify-between gap-2" asChild>
              <Link href="/login" onClick={handleLogout}>
                Logout
                <LogOut className="ml-2 size-3.5" />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>
    </>
  );
};

const Header = () => {
  return (
    <header className="relative z-10">
      <div className="container mx-auto flex flex-col flex-wrap items-center gap-2 p-5 md:flex-row">
        <Link href="/" className="mb-4 flex items-center font-medium md:mb-0">
          <div className="size-10 rounded-full bg-accent p-2">
            <img src="/icon.png" alt="icon" className="invert dark:invert-0" />
          </div>
          <h1 className="ml-3 text-xl">CTX</h1>
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-2 md:ml-auto">
          <NavigationItems />
        </nav>
      </div>
    </header>
  );
};

export default Header;
