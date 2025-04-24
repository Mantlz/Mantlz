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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    const allowedOrigin = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://form-quay.vercel.app';
      
    const headers = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    };
    
    return new NextResponse(null, { headers });
  }

  // For regular requests
  const authResult = await auth();
  const response = NextResponse.next();
  
  // Add CORS headers for API routes
  if (req.nextUrl.pathname.startsWith('/api')) {
    const allowedOrigin = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://form-quay.vercel.app';
      
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  
  // Allow auth routes even without userId, they'll handle auth internally
  if (isAuthRoute(req)) {
    return response;
  }
  
  // Protect dashboard and other routes
  if (!authResult.userId && isProtectedRoute(req)) {
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