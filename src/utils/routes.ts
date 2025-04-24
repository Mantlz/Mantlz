import { createRouteMatcher } from "@clerk/nextjs/server";

// Define protected routes that require authentication
export const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/chat(.*)',
  '/chat-history(.*)',
  '/settings(.*)',
  '/profile(.*)',
  '/dashboard/settings(.*)',
]);

// Define auth routes that need user context but shouldn't redirect
export const isAuthRoute = createRouteMatcher([
  '/api/auth/getDatabaseSyncStatus',
  '/welcome-back',
  '/welcome'
]); 