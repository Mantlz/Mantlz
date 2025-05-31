import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }

  if (typeof window === 'undefined') {
    // Only run on server
    if (typeof self === 'undefined' && typeof global !== 'undefined') {
      // Polyfill self for server environment
      (global as unknown as Record<string, typeof global>).self = global;
    }
  }
}

export const onRequestError = Sentry.captureRequestError;
