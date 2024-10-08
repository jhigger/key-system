import { KeyRound, LogOut } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "~/state/userStore";
import { Button } from "./ui/button";

const Header = () => {
  const { user, logout } = useUserStore();

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
            <Button variant={"ghost"} asChild>
              <Link href="/login" onClick={logout}>
                Logout
                <LogOut className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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
