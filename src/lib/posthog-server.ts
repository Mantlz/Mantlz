import { PostHog } from 'posthog-node'

// Server-side PostHog configuration
export const serverPostHog = new PostHog(
  process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
  {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
  }
) 