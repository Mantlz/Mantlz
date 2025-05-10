import posthog from 'posthog-js'
import { PostHog } from 'posthog-node'

// Client-side PostHog configuration
export const clientPostHog = posthog

// Server-side PostHog configuration
export const serverPostHog = new PostHog(
  process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
  {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
  }
)

// Initialize PostHog on the client side
export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      },
      capture_pageview: false, // We'll handle this manually
    })
  }
} 