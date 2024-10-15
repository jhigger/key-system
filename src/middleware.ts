import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { type RoleType } from "./types/user";

const isProtectedRoute = createRouteMatcher([
  "/",
  "/admin(.*)",
  "/account(.*)",
]);
const isAuthRoute = createRouteMatcher(["/login(.*)", "/register(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = auth();

  if (!userId) return console.log("no user");

  const user = await clerkClient().users.getUser(userId);
  const userRole = (user.publicMetadata.role as RoleType) ?? "user";
  console.log("userRole", userRole);

  if (isProtectedRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Check if user is admin and trying to access non-admin routes
    if (userRole === "admin" && !isAdminRoute(req)) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // User is authenticated, allow access to protected routes
    return NextResponse.next();
  }

  if (isAuthRoute(req) && userId) {
    // Redirect admin to admin dashboard, others to home
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
