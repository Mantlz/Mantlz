import { createClient } from "jstack"
import type { AppRouter } from "@/server"

export const client = createClient<AppRouter>({
  baseUrl: `${getBaseUrl()}/api`,
  credentials: 'include',
})

function getBaseUrl() {
  // Check for browser environment first
  if (typeof window !== 'undefined') {
    // Use the current hostname in production
    return window.location.origin
  }
  
  // For server-side rendering with Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // For local development
  return `http://localhost:3000`
}