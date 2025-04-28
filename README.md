# Mantlz

A modern form management platform that enables you to create beautiful, customizable forms in minutes. Built with Next.js and TypeScript.

## Project Overview

Mantlz consists of two main components:

1. **Main Application (`src/app`)** - A Next.js application that provides the dashboard and form management interface.
2. **SDK Library (`mantlz-sdk`)** - A TypeScript library that provides React components for creating various form types.

## Features

- **Multiple Form Types**: Create feedback forms, contact forms, waitlist forms, and more
- **Customizable Themes**: Choose from a variety of pre-built themes or create custom designs
- **Dark Mode Support**: Automatic dark mode detection with manual override options
- **Form Analytics**: Track form submissions and analyze responses
- **Developer-Friendly**: TypeScript native with React Hook Form and Zod validation

## Getting Started


### Using the SDK

The Mantlz SDK can be installed separately for use in your own projects:

```bash
npm install @mantlz/nextjs
```

Make sure to wrap your application with the `MantlzProvider`:

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

## Available Form Components

### Feedback Form

```tsx
import { FeedbackForm } from "@mantlz/nextjs";

export default function FeedbackPage() {
  return (
    <div className="container mx-auto p-4">
      <FeedbackForm 
        formId="your-form-id"
        theme="colorful"
    </div>
  );
}
```

### Contact Form

```tsx
import { ContactForm } from "@mantlz/nextjs";

export default function ContactPage() {
  return (
    <div className="container mx-auto p-4">
      <ContactForm 
        formId="your-form-id"
        title="Get in Touch"
        description="Have questions? We'd love to hear from you."
      />
    </div>
  );
}
```

### Waitlist Form

```tsx
import { WaitlistForm } from "@mantlz/nextjs";

export default function WaitlistPage() {
  return (
    <div className="container mx-auto p-4">
      <WaitlistForm
        formId="your-form-id"
        title="Get early access"
        description="Join the waitlist to get early access to the platform."
        showUsersJoined={true}
      />
    </div>
  );
}
```

## Theming and Customization

All form components support multiple theming options:

```tsx
// Using preset themes
<FeedbackForm
  formId="your-form-id"
  theme="neobrutalism"
/>

// Using custom appearance
<ContactForm
  formId="your-form-id"
  appearance={{
    background: '#f8f9fa',
    border: '1px solid #dee2e6',
    submitButton: 'bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg',
    formInput: 'bg-white border border-zinc-300 rounded px-3 py-2',
  }}
/>
```

## License

MIT
