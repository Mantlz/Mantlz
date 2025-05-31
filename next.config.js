/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/api/:path*',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: process.env.ALLOWED_ORIGIN || '*',
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET, POST, PUT, DELETE, OPTIONS',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'Content-Type, Authorization',
            },
          ],
        },
      ];
    }
    return [];
  },

  // Optimized images config
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        hostname: 'cdn.sanity.io',
        protocol: 'https',
      },
      {
        hostname: 'avatars.githubusercontent.com',
        protocol: 'https',
      },
      {
        hostname: 'files.stripe.com',
        protocol: 'https',
      },
    ],
  },
};

// Optimized Sentry config for faster builds
const { withSentryConfig } = require('@sentry/nextjs');

const sentryOptions = {
  org: 'mantlz',
  project: 'mantlz',
  silent: !process.env.CI,
  
  // Major build time optimizations
  widenClientFileUpload: false, // This is your biggest bottleneck
  disableLogger: true,
  automaticVercelMonitors: true,
  
  //Skip source map operations in development
  dryRun: process.env.NODE_ENV === 'development',
  hideSourceMaps: true,
  
  // Reduce Sentry webpack plugin overhead
  sourcemaps: {
    disable: process.env.NODE_ENV === 'development',
  },
};

module.exports = withSentryConfig(nextConfig, sentryOptions);
