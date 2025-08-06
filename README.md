<div align="center">

  <h1>Mantlz</h1>
  

  A modern headless form management platform that enables developers to create beautiful, customizable forms with a powerful dashboard and TypeScript-native SDK. Built with Next.js and designed for modern web applications.
  
  <p align="center">
    <a href="https://www.gnu.org/licenses/agpl-3.0">
      <img src="https://img.shields.io/badge/License-AGPL_v3-blue.svg?style=for-the-badge" alt="License: AGPL v3" />
    </a>
    <a href="https://github.com/artistatbl/Mantlz">
      <img src="https://img.shields.io/badge/Version-0.1.0-green.svg?style=for-the-badge" alt="Version" />
    </a>
  </p>
  
  <p align="center">
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    </a>
    <a href="https://nextjs.org/">
      <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    </a>
    <a href="https://reactjs.org/">
      <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    </a>
    <a href="https://turbo.build/repo">
      <img src="https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo" />
    </a>
    <a href="https://bun.sh/">
      <img src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" />
    </a>
    <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    </a>
  </p>
  
  <!-- <p align="center">
    <a href="https://github.com/artistatbl/Mantlz/stargazers">
      <img src="https://img.shields.io/github/stars/artistatbl/Mantlz?style=for-the-badge&logo=github" alt="GitHub stars" />
    </a>
    <a href="https://github.com/artistatbl/Mantlz/issues">
      <img src="https://img.shields.io/github/issues/artistatbl/Mantlz?style=for-the-badge&logo=github" alt="GitHub issues" />
    </a>
    <a href="https://github.com/artistatbl/Mantlz/pulls">
      <img src="https://img.shields.io/github/issues-pr/artistatbl/Mantlz?style=for-the-badge&logo=github" alt="GitHub pull requests" />
    </a>
  </p> -->
  
  <p align="center">
    <a href="https://coderabbit.ai">
      <img src="https://img.shields.io/badge/CodeRabbit-AI_Reviews-blue?style=for-the-badge&logo=robot" alt="CodeRabbit" />
    </a>
    <a href="https://github.com/artistatbl/Mantlz/actions">
      <img src="https://img.shields.io/badge/CI%2FCD-Automated-brightgreen?style=for-the-badge&logo=github-actions&logoColor=white" alt="CI/CD" />
    </a>
    <a href="https://github.com/artistatbl/Mantlz">
      <img src="https://img.shields.io/badge/Coverage-Tracked-yellow?style=for-the-badge&logo=codecov&logoColor=white" alt="Code Coverage" />
    </a>
    <a href="https://github.com/artistatbl/Mantlz">
      <img src="https://img.shields.io/badge/Security-Scanned-red?style=for-the-badge&logo=security&logoColor=white" alt="Security Scan" />
    </a>
    <a href="https://github.com/artistatbl/Mantlz">
      <img src="https://img.shields.io/badge/Dependencies-Monitored-orange?style=for-the-badge&logo=dependabot&logoColor=white" alt="Dependency Status" />
    </a>
  </p>
  
  <img src="./public/og-image.png" alt="Mantlz" width="600" />
</div>

## Project Overview

Mantlz consists of two main components:

1. **Main Application** - A Next.js dashboard for form management, analytics, and configuration
2. **SDK Library (`@mantlz/nextjs`)** - A TypeScript-native React component library for embedding forms

## Features

### Dashboard Features
- **Form Builder**: Visual form builder with drag-and-drop interface
- **Analytics Dashboard**: Real-time form submission analytics and insights
- **User Management**: Authentication and user management with Clerk
- **Billing Integration**: Stripe-powered subscription management
- **Campaign Management**: Email campaigns and automation
- **API Management**: RESTful API for form submissions and data

### SDK Features
- **Multiple Form Types**: Waitlist, contact, feedback, survey, application, order, and custom forms
- **Built-in Themes**: Default, modern, neobrutalism, and simple themes
- **Dark Mode Support**: Automatic dark mode detection with manual override
- **TypeScript Native**: Full TypeScript support with Zod validation
- **Customizable Appearance**: Extensive styling and theming options
- **File Uploads**: Support for file attachments with validation

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mantlz/mantlz.git
   cd mantlz
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or if you prefer bun
   bun install
   ```

3. **Set up your database**
   
   Create a PostgreSQL database locally or use a cloud provider like Supabase, Neon, or Railway.

4. **Configure environment variables**
   
   Copy the example environment file and configure it:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration. Here are the required environment variables:

   **Database Configuration:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/mantlz"
   ```

   **Authentication (Clerk):**
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_key_here"
   CLERK_SECRET_KEY="sk_test_your_secret_here"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
   ```

   **Email Service (Resend):**
   ```env
   RESEND_API_KEY="re_your_api_key_here"
   RESEND_FROM_EMAIL="contact@yourdomain.com"
   ```

   **Payment Processing (Stripe):**
   ```env
   STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
   STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
   STRIPE_CLIENT_ID="ca_your_client_id"
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_your_public_key"
   NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID="price_your_standard_price_id"
   NEXT_PUBLIC_STRIPE_PRO_PRICE_ID="price_your_pro_price_id"
   ```



   **File Uploads (Uploadcare):**
   ```env
   NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY="your_uploadcare_public_key"
   ```

   **Analytics (PostHog) - Optional:**
   ```env
   NEXT_PUBLIC_POSTHOG_KEY="phc_your_posthog_key"
   NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
   ```

   **Application URLs:**
   ```env
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_DOMAIN="localhost:3000"
   ```

   **Rate Limiting (Upstash Redis) - Optional:**
   ```env
   UPSTASH_REDIS_REST_URL="your_redis_url"
   UPSTASH_REDIS_REST_TOKEN="your_redis_token"
   ```

5. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000)

### Quick Start with Docker

For a faster setup, you can use Docker Compose:

```bash
# Clone and navigate to the project
git clone https://github.com/mantlz/mantlz.git
cd mantlz

# Start with Docker Compose
docker-compose up -d
```

This will start the application with a PostgreSQL database. The app will be available at [http://localhost:3000](http://localhost:3000).

### Service Setup Guide

**1. Database Setup (Choose one):**
- **Local PostgreSQL**: Install PostgreSQL locally and create a database
- **Supabase**: Create a free account at [supabase.com](https://supabase.com)
- **Neon**: Create a free account at [neon.tech](https://neon.tech)
- **Railway**: Create a free account at [railway.app](https://railway.app)

**2. Authentication Setup (Clerk):**
- Create a free account at [clerk.com](https://clerk.com)
- Create a new application
- Copy the publishable key and secret key to your `.env.local`

**3. Email Service Setup (Resend):**
- Create a free account at [resend.com](https://resend.com)
- Generate an API key
- Add your domain for sending emails

**4. Payment Processing Setup (Stripe):**
- Create a free account at [stripe.com](https://stripe.com)
- Get your API keys from the dashboard
- Create products and pricing plans
- Set up webhooks for your local development



**6. File Upload Setup (Uploadcare):**
- Create a free account at [uploadcare.com](https://uploadcare.com)
- Get your public key from the dashboard

### Troubleshooting

**Common Issues:**

1. **Database Connection Issues:**
   - Ensure PostgreSQL is running
   - Check your DATABASE_URL format
   - Verify database credentials and permissions
   - Run `npx prisma db push` to sync the schema

2. **Authentication Not Working:**
   - Verify Clerk keys are correct
   - Check that your domain is added to Clerk's allowed origins
   - Ensure CLERK_SECRET_KEY starts with `sk_`

3. **Email Service Issues:**
   - Verify your Resend API key
   - Check that your sending domain is verified in Resend
   - Ensure RESEND_FROM_EMAIL uses a verified domain

4. **Stripe Payment Issues:**
   - Use test keys for development (they start with `sk_test_` and `pk_test_`)
   - Set up webhook endpoints in Stripe dashboard
   - Verify price IDs match your Stripe products

5. **Build Errors:**
   - Run `npm run lint` to check for code issues
   - Ensure all required environment variables are set
   - Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

**Getting Help:**
- Check the [GitHub Issues](https://github.com/mantlz/mantlz/issues) for known problems
- Join our [Discord community](https://discord.gg/mantlz) for support
- Review the [documentation](https://docs.mantlz.com) for detailed guides



## Form Types Supported

- **Waitlist**: Collect email signups with optional user count display
- **Contact**: Contact forms with customizable fields
- **Feedback**: Feedback collection with rating systems
- **Survey**: Multi-step surveys with conditional logic
- **Application**: Job applications and form submissions
- **Order**: Product ordering forms with payment integration
- **Custom**: Fully customizable forms with any field configuration

## API Reference

For detailed API documentation, visit: [https://docs.mantlz.com](https://docs.mantlz.com)

## Tech Stack

### Dashboard
- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI

### SDK
- **Framework**: React with TypeScript
- **Validation**: Zod
- **Styling**: CSS-in-JS with theme system
- **Build**: tsup for optimal bundling

## Contributing

We welcome contributions from the community! Mantlz is now fully open source under the AGPL-3.0 license.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests if applicable
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mantlz/mantlz.git
   cd mantlz
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

### Reporting Issues

If you find a bug or have a feature request, please [open an issue](https://github.com/mantlz/mantlz/issues) on GitHub.

### Security

For security vulnerabilities, please email security@mantlz.com instead of opening a public issue. See our [Security Policy](SECURITY.md) for more details.

## Community

- **GitHub Discussions**: [Join the conversation](https://github.com/mantlz/mantlz/discussions)
- **Discord**: [Join our Discord server](https://discord.gg/mantlz) (coming soon)
- **Twitter**: [@trymantlz](https://x.com/trymantlz)

