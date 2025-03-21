import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/chat(.*)',
  '/chat-history(.*)',
  '/settings(.*)',
  '/profile(.*)',
  '/dashboard/settings(.*)',
]);

// Define auth routes that need user context but shouldn't redirect
const isAuthRoute = createRouteMatcher([
  '/api/auth/getDatabaseSyncStatus',
  '/welcome-back',
  '/welcome'  // Add the welcome page too
]);

export default clerkMiddleware(async (auth, req) => {
  const authResult = await auth();
  
  // Allow auth routes even without userId, they'll handle auth internally
  if (isAuthRoute(req)) {
    return NextResponse.next();
  }
  
  // Protect dashboard and other routes
  if (!authResult.userId && isProtectedRoute(req)) {
    return authResult.redirectToSignIn();
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};