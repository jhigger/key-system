import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { type RoleType } from "./types/user";

const isAuthRoute = createRouteMatcher(["/login(.*)", "/register(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAccountRoute = createRouteMatcher(["/account(.*)"]);
const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/account(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = auth();

  if (!userId) {
    if (isProtectedRoute(req)) {
      // Redirect unauthenticated users to login page
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  const user = await clerkClient().users.getUser(userId);
  const userRole = (user.publicMetadata.role as RoleType) ?? "user";

  if (userRole !== "admin") {
    if (isAdminRoute(req)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else {
    if (isAccountRoute(req)) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  if (isAuthRoute(req)) {
    const redirectUrl = userRole === "admin" ? "/admin" : "/";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // For all other routes, continue without any redirection
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
