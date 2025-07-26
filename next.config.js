/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix prettier version conflicts with turbopack
  serverExternalPackages: [],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure prettier uses the same version across all modules
      config.resolve.alias = {
        ...config.resolve.alias,
        'prettier': require.resolve('prettier'),
        'prettier/plugins/html': require.resolve('prettier/plugins/html'),
        'prettier/standalone': require.resolve('prettier/standalone')
      };
    }
    return config;
  },
  rewrites: async () => {
    return [
      {
        source: "/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)",
        destination: "/shell",
      },
    ];
  },
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
      {
        hostname: 'img.clerk.com',
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
