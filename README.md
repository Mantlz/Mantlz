# Mantlz

A modern headless form management platform that enables developers to create beautiful, customizable forms with a powerful dashboard and TypeScript-native SDK. Built with Next.js and designed for modern web applications.

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

### Platform Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`

### Using the SDK

Install the Mantlz SDK in your project:

```bash
npm install @mantlz/nextjs
```

Wrap your application with the `MantlzProvider`:

```tsx
import { MantlzProvider } from "@mantlz/nextjs";

export default function App({ children }) {
  return (
    <MantlzProvider apiKey="your-mantlz-api-key">
      {children}
    </MantlzProvider>
  );
}
```

## Using the Mantlz Component

The SDK provides a single `Mantlz` component that can render different form types based on your dashboard configuration:

### Basic Usage

```tsx
import { Mantlz } from "@mantlz/nextjs";

export default function MyForm() {
  return (
    <div className="container mx-auto p-4">
      <Mantlz formId="your-form-id" />
    </div>
  );
}
```

### With Custom Theme

```tsx
import { Mantlz } from "@mantlz/nextjs";

export default function ThemedForm() {
  return (
    <Mantlz 
      formId="your-form-id"
      theme="neobrutalism"
    />
  );
}
```

### Waitlist Form with User Count

```tsx
import { Mantlz } from "@mantlz/nextjs";

export default function WaitlistPage() {
  return (
    <Mantlz
      formId="your-form-id"
      showUsersJoined={true}
      usersJoinedCount={1250}
      usersJoinedLabel="developers have joined"
    />
  );
}
```

## Theming and Customization

The Mantlz component supports extensive theming and customization options:

### Built-in Themes

```tsx
// Available themes: default, modern, neobrutalism, simple
<Mantlz
  formId="your-form-id"
  theme="neobrutalism"
/>
```

### Custom Appearance

```tsx
<Mantlz
  formId="your-form-id"
  appearance={{
    variables: {
      primaryColor: '#6366f1',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
    },
    elements: {
      container: 'max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg',
      title: 'text-2xl font-bold text-gray-900 mb-4',
      input: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500',
      button: 'w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors',
    }
  }}
/>
```

## Form Types Supported

- **Waitlist**: Collect email signups with optional user count display
- **Contact**: Contact forms with customizable fields
- **Feedback**: Feedback collection with rating systems
- **Survey**: Multi-step surveys with conditional logic
- **Application**: Job applications and form submissions
- **Order**: Product ordering forms with payment integration
- **Custom**: Fully customizable forms with any field configuration

## API Reference

For detailed API documentation, visit: [https://docs.mantlz.app](https://docs.mantlz.app)

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

## License

MIT
