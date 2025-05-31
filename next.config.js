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

  // Only apply webpack config when NOT using turbopack (production builds)
  webpack: (config, { dev }) => {
    // Skip webpack config if using turbopack in development
    if (dev && process.env.TURBOPACK) {
      return config;
    }

    if (!dev) {
      // Simplified chunk splitting for production builds only
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true,
          },
        },
      };

      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    return config;
  },
  // Simplified headers for API routes only
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

  // Output optimization for Vercel
  output: 'standalone',
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
  
  // Skip source map operations in development
  // dryRun: process.env.NODE_ENV === 'development',
  // hideSourceMaps: true,
  
  // // Reduce Sentry webpack plugin overhead
  // sourcemaps: {
  //   disable: process.env.NODE_ENV === 'development',
  // },
};

module.exports = withSentryConfig(withBundleAnalyzer(nextConfig), sentryOptions);
