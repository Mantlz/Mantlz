# @mantlz/nextjs

A TypeScript-native form backend service for Next.js applications. Build beautiful, customizable forms with built-in validation, theming, and analytics.

## Features

- 🎨 **Multiple Themes**: Built-in themes (default, modern, neobrutalism, simple)
- 🌙 **Dark Mode**: Automatic dark mode support
- 📱 **Responsive**: Mobile-first responsive design
- 🔧 **TypeScript**: Full TypeScript support with type safety
- 🎯 **Form Types**: Support for waitlist, contact, feedback, survey, application, order, and custom forms
- 📊 **Analytics**: Built-in form analytics and submission tracking
- 🔒 **Validation**: Zod-powered form validation
- 🎨 **Customizable**: Extensive theming and styling options
- 📁 **File Uploads**: Support for file uploads with drag-and-drop

## Installation

```bash
npm install @mantlz/nextjs
# or
yarn add @mantlz/nextjs
# or
pnpm add @mantlz/nextjs
```

## Quick Start

1. **Set up the provider** in your root layout:

```tsx
import { MantlzProvider } from '@mantlz/nextjs';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MantlzProvider apiKey="your-api-key">
          {children}
        </MantlzProvider>
      </body>
    </html>
  );
}
```

2. **Use the Mantlz component**:

```tsx
import { Mantlz } from '@mantlz/nextjs';

export default function ContactPage() {
  return (
    <div className="container mx-auto p-4">
      <Mantlz formId="your-form-id" />
    </div>
  );
}
```


## Form Examples

### Basic Form

```tsx
import { Mantlz } from '@mantlz/nextjs';

export default function BasicForm() {
  return <Mantlz formId="your-form-id" />;
}
```

### Waitlist Form with User Count

```tsx
import { Mantlz } from '@mantlz/nextjs';

export default function WaitlistForm() {
  return (
    <Mantlz
      formId="your-waitlist-form-id"
      showUsersJoined={true}
      usersJoinedCount={1250}
      usersJoinedLabel="developers have joined"
    />
  );
}
```

### Themed Form

```tsx
import { Mantlz } from '@mantlz/nextjs';

export default function ThemedForm() {
  return (
    <Mantlz
      formId="your-form-id"
      theme="neobrutalism"
    />
  );
}
```

### Custom Styled Form

```tsx
import { Mantlz } from '@mantlz/nextjs';

export default function CustomForm() {
  return (
    <Mantlz
      formId="your-form-id"
      appearance={{
        variables: {
          primaryColor: '#6366f1',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
        },
        elements: {
          container: 'max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg',
          title: 'text-3xl font-bold text-gray-900 mb-6',
          description: 'text-gray-600 mb-8',
          input: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          button: 'w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold',
        }
      }}
    />
  );
}
```

## Theming and Customization

### Built-in Themes

The SDK includes several built-in themes:

- `default`: Clean, minimal design
- `modern`: Contemporary styling with subtle shadows
- `neobrutalism`: Bold, high-contrast design
- `simple`: Minimal styling for maximum customization

```tsx
<Mantlz
  formId="your-form-id"
  theme="neobrutalism"
/>
```

### Custom Appearance

You can customize every aspect of your forms using the `appearance` prop:

```tsx
<Mantlz
  formId="your-form-id"
  appearance={{
    variables: {
      primaryColor: '#6366f1',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      fontFamily: 'Inter, sans-serif',
    },
    elements: {
      container: 'max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg',
      title: 'text-2xl font-bold text-gray-900 mb-4',
      description: 'text-gray-600 mb-6',
      input: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500',
      button: 'w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors',
      error: 'text-red-600 text-sm mt-1',
      success: 'text-green-600 text-sm mt-1',
    }
  }}
/>
```

## Form Types

Mantlz supports various form types that you can configure in your dashboard:

- **waitlist**: Email collection with optional user count display
- **contact**: Contact forms with customizable fields
- **feedback**: Feedback collection with rating systems
- **survey**: Multi-step surveys with conditional logic
- **application**: Job applications and form submissions
- **order**: Product ordering forms
- **analytics-opt-in**: GDPR-compliant analytics consent
- **rsvp**: Event RSVP forms
- **custom**: Fully customizable forms

## API Reference

### Mantlz Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `formId` | `string` | ✅ | Unique identifier for your form |
| `theme` | `'default' \| 'modern' \| 'neobrutalism' \| 'simple'` | ❌ | Built-in theme to use |
| `appearance` | `AppearanceConfig` | ❌ | Custom styling configuration |
| `showUsersJoined` | `boolean` | ❌ | Show user count for waitlist forms |
| `usersJoinedCount` | `number` | ❌ | Custom user count (overrides API value) |
| `usersJoinedLabel` | `string` | ❌ | Custom label for user count |
| `redirectUrl` | `string` | ❌ | URL to redirect after successful submission |


### MantlzProvider Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `apiKey` | `string` | ✅ | Your Mantlz API key |
| `baseUrl` | `string` | ❌ | Custom API base URL |
| `children` | `ReactNode` | ✅ | Your app components |



## Documentation

For detailed documentation and examples, visit: [https://docs.mantlz.com](https://docs.mantlz.com)

## Getting Help

- 📖 [Documentation](https://docs.mantlz.com)
- 💬 [Discord Community](https://discord.gg/mantlz)
- 🐛 [Report Issues](https://github.com/mantlz/mantlz/issues)
- 📧 [Email Support](mailto:support@mantlz.com)


## License

MIT © [Mantlz](https://mantlz.com)