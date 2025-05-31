const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Core performance optimizations
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-icons',
      '@tabler/icons-react',
      'lucide-react',
      'recharts',
      '@clerk/nextjs',
      'framer-motion',
      'date-fns',
      '@editorjs/editorjs',
    ],
    serverComponentsExternalPackages: [
      '@uploadcare/upload-client',
      '@uploadcare/react-uploader',
      'wrangler'
    ],
  },

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
  webpack: (config, { dev, isServer }) => {
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

    if (isServer) {
      // Fixes the "self is not defined" error by providing a polyfill
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Provide empty objects for browser globals
        self: false
      };
    }
    return config;
  },

  // Build performance settings
  staticPageGenerationTimeout: 60,
  
  // Essential settings
  compress: true,
  poweredByHeader: false,
  generateEtags: false,

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
    domains: ['files.stripe.com', 'cdn.sanity.io', 'lh3.googleusercontent.com', 'ucarecdn.com'],
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
  dryRun: process.env.NODE_ENV === 'development',
  hideSourceMaps: true,
  
  // Reduce Sentry webpack plugin overhead
  sourcemaps: {
    disable: process.env.NODE_ENV === 'development',
  },
};

module.exports = withSentryConfig(withBundleAnalyzer(nextConfig), sentryOptions);
