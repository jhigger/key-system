import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { type RoleType } from "./types/user";

const isProtectedRoute = createRouteMatcher(["/account(.*)"]);
const isAuthRoute = createRouteMatcher(["/login(.*)", "/register(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = auth();

  if (!userId) {
    if (isProtectedRoute(req) || isAdminRoute(req)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  const user = await clerkClient().users.getUser(userId);
  const userRole = (user.publicMetadata.role as RoleType) ?? "user";

  // Handle root path separately
  if (req.nextUrl.pathname === "/") {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (isAdminRoute(req) && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
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
