# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.12.0
ARG NODE_OPTIONS="--max-old-space-size=8192"

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Create a stage for installing production dependencies.
FROM base as deps

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies with specific NODE_OPTIONS
RUN --mount=type=cache,target=/root/.npm \
    NODE_OPTIONS=${NODE_OPTIONS} npm ci

################################################################################
# Create a stage for building the application.
FROM deps as build

# Copy source files and configurations
COPY src ./src
COPY public ./public
COPY next.config.* .
COPY tsconfig.json .
COPY postcss.config.mjs .
COPY sanity.config.ts .
COPY sentry.edge.config.ts .
COPY sentry.server.config.ts .

# Set build-time environment variables with development defaults
ENV NODE_ENV="development"
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mantlz?schema=public"
ENV NEXT_PUBLIC_SANITY_PROJECT_ID="development"
ENV NEXT_PUBLIC_SANITY_DATASET="development"
ENV NEXT_PUBLIC_SENTRY_DSN="https://dummy@dummy.ingest.sentry.io/0"
ENV RESEND_API_KEY="re_development_key"
ENV UPSTASH_REDIS_REST_URL="https://dummy-redis-url"
ENV UPSTASH_REDIS_REST_TOKEN="dummy_token"
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test"
ENV CLERK_SECRET_KEY="sk_test"
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
ENV STRIPE_SECRET_KEY="sk_test"
ENV STRIPE_WEBHOOK_SECRET="whsec_test"
ENV NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Generate Prisma client and build the application with increased memory limit
RUN NODE_OPTIONS=${NODE_OPTIONS} npx prisma generate && \
    NODE_OPTIONS=${NODE_OPTIONS} npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
FROM base as final

# Use production node environment by default (can be overridden by docker-compose)
ENV NODE_ENV=development
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy all environment variables from build stage
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mantlz?schema=public"
ENV NEXT_PUBLIC_SANITY_PROJECT_ID="development"
ENV NEXT_PUBLIC_SANITY_DATASET="development"
ENV NEXT_PUBLIC_SENTRY_DSN="https://dummy@dummy.ingest.sentry.io/0"
ENV RESEND_API_KEY="re_development_key"
ENV UPSTASH_REDIS_REST_URL="https://dummy-redis-url"
ENV UPSTASH_REDIS_REST_TOKEN="dummy_token"
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test"
ENV CLERK_SECRET_KEY="sk_test"
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
ENV STRIPE_SECRET_KEY="sk_test"
ENV STRIPE_WEBHOOK_SECRET="whsec_test"
ENV NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies and built application
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm start
