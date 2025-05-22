import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create a new ratelimiter that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
})

// List of known bot user agents (extend this list as needed)
const botUserAgents = [
  'bot',
  'spider',
  'crawl',
  'Go-http-client',
  'python-requests',
  'curl',
  'Postman',
]

const isBot = (userAgent: string): boolean => {
  const lowerUA = userAgent.toLowerCase()
  return botUserAgents.some(bot => lowerUA.includes(bot))
}

export async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-real-ip') || 
             request.headers.get('x-forwarded-for')?.split(',')[0] || 
             '127.0.0.1'
  const userAgent = request.headers.get('user-agent') || ''

  // Block suspicious bots
  if (isBot(userAgent) && !userAgent.includes('googlebot')) {
    return new NextResponse('Not allowed', { status: 403 })
  }

  // Apply rate limiting
  const { success, limit, reset, remaining } = await ratelimit.limit(
    `ratelimit_${ip}`
  )
  
  // Set rate limit headers
  const res = success
    ? NextResponse.next()
    : NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, statusText: 'Too Many Requests' }
      )

  res.headers.set('X-RateLimit-Limit', limit.toString())
  res.headers.set('X-RateLimit-Remaining', remaining.toString())
  res.headers.set('X-RateLimit-Reset', reset.toString())

  return res
}

// Configure which routes to apply the middleware to
export const config = {
  matcher: [
    // Apply to all routes except static files and api routes
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
} 