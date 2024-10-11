import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { useUserStore } from "./state/user.store";

export function middleware(request: NextRequest) {
  const user = useUserStore.getState().user; // TODO: change to cookie

  // If the user is logged in and trying to access /login or /register, redirect to home
  if (
    user !== null &&
    ["/login", "/register", "/account", "/admin"].includes(
      request.nextUrl.pathname,
    )
  ) {
    console.log("User is logged in, redirecting to home");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to all other routes, including home page if logged in
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/account", "/admin"],
};
