import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { handlePreflightRequest, addCorsHeadersToResponse, handleRedirectWithCors } from "./utils/cors";
import { isProtectedRoute, isAuthRoute } from "./utils/routes";

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  
  // Check if the request is coming from the API subdomain
  const isApiSubdomain = hostname.startsWith('api.');
  
  // Block v1 API routes on the main domain
  if (!isApiSubdomain && url.pathname.startsWith('/api/v1')) {
    return new NextResponse('Please use api.mantlz.app for v1 API endpoints', { 
      status: 301,
      headers: {
        'Location': `https://api.mantlz.app${url.pathname}${url.search}`,
      }
    });
  }

  // If it's the API subdomain, only allow v1 API routes
  if (isApiSubdomain) {
    if (!url.pathname.startsWith('/api/v1')) {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handlePreflightRequest(req);
  }

  // For regular requests
  const authResult = await auth();
  let response = NextResponse.next();
  
  // Add CORS headers for API routes
  if (url.pathname.startsWith('/api')) {
    response = addCorsHeadersToResponse(response, req);
  }
  
  // Allow auth routes even without userId, they'll handle auth internally
  if (isAuthRoute(req)) {
    return response;
  }
  
  // Protect dashboard and other routes
  if (!authResult.userId && isProtectedRoute(req)) {
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
