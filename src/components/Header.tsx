import { KeyRound, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUserStore } from "~/state/userStore";
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

const Header = () => {
  const { user, logout } = useUserStore();

  const [isSmallScreen, setIsSmallScreen] = useState(false);

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
    <header>
      <div className="container mx-auto flex flex-col flex-wrap items-center gap-2 p-5 md:flex-row">
        <Link href="/" className="mb-4 flex items-center font-medium md:mb-0">
          <div className="size-10 rounded-full bg-accent p-2">
            <KeyRound className="size-full text-white" />
          </div>
          <h1 className="ml-3 text-xl">Reseller Panel</h1>
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-2 md:ml-auto">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"}>Account</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isSmallScreen ? "center" : "end"}>
                  <DropdownMenuLabel className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap md:max-w-full">
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>My Keys</DropdownMenuItem>
                  <DropdownMenuItem>Order History</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex justify-between" asChild>
                    <Link href="/login" onClick={logout}>
                      Logout
                      <LogOut className="ml-2 size-3.5" />
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant={"outline"} asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
