import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { handlePreflightRequest, addCorsHeadersToResponse, handleRedirectWithCors } from "./utils/cors";
import { isProtectedRoute, isAuthRoute } from "./utils/routes";

export default clerkMiddleware(async (auth, req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handlePreflightRequest(req); // Pass the request object to access origin
  }

  // For regular requests
  const authResult = await auth();
  let response = NextResponse.next();
  
  // Add CORS headers for API routes
  if (req.nextUrl.pathname.startsWith('/api')) {
    response = addCorsHeadersToResponse(response, req); // Pass both response and request
  }
  
  // Allow auth routes even without userId, they'll handle auth internally
  if (isAuthRoute(req)) {
    return response;
  }
  
  // Protect dashboard and other routes
  if (!authResult.userId && isProtectedRoute(req)) {
    // Use the new redirect function that preserves CORS headers
    const signInUrl = authResult.redirectToSignIn().headers.get('location');
    if (signInUrl) {
      return handleRedirectWithCors(req, signInUrl);
    }
    return authResult.redirectToSignIn();
  }
  
  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
