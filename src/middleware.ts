import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { handlePreflightRequest, addCorsHeadersToResponse, handleRedirectWithCors } from "./utils/cors";
import { isProtectedRoute, isAuthRoute } from "./utils/routes";
import { ratelimitConfig } from "./lib/ratelimiter";

// Bot detection patterns - compiled regex for better performance
const botPatterns = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /semrush/i,
  /ahrefs/i,
  /scan/i,
].map(pattern => new RegExp(pattern));

// Cache for bot detection results
const botCache = new Map<string, boolean>();
const BOT_CACHE_TTL = 3600000; // 1 hour

const isBot = (userAgent: string | null): boolean => {
  if (!userAgent) return true;
  
  // Check cache first
  const cached = botCache.get(userAgent);
  if (cached !== undefined) return cached;
  
  // Perform check
  const result = botPatterns.some(pattern => pattern.test(userAgent));
  
  // Cache result
  botCache.set(userAgent, result);
  setTimeout(() => botCache.delete(userAgent), BOT_CACHE_TTL);
  
  return result;
};

// Cache for rate limit results
const rateLimitCache = new Map<string, { timestamp: number; result: any }>();
const RATE_LIMIT_CACHE_TTL = 1000; // 1 second

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  const userAgent = req.headers.get('user-agent');
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous';
  
  // Block suspicious bots
  if (isBot(userAgent)) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  // Apply rate limiting if enabled
  if (ratelimitConfig.enabled && ratelimitConfig.ratelimit) {
    try {
      // Check cache first
      const cached = rateLimitCache.get(ip);
      if (cached && Date.now() - cached.timestamp < RATE_LIMIT_CACHE_TTL) {
        const { success, limit, reset, remaining } = cached.result;
        if (!success) {
          return new NextResponse('Too Many Requests', {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
              'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
            },
          });
        }
      } else {
        const result = await ratelimitConfig.ratelimit.limit(ip);
        rateLimitCache.set(ip, { timestamp: Date.now(), result });
        
        if (!result.success) {
          return new NextResponse('Too Many Requests', {
            status: 429,
            headers: {
              'X-RateLimit-Limit': result.limit.toString(),
              'X-RateLimit-Remaining': result.remaining.toString(),
              'X-RateLimit-Reset': result.reset.toString(),
              'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
            },
          });
        }
      }
    } catch (error) {
      console.error('Rate limiting error:', error);
    }
  }

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
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
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
