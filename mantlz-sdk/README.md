# Mantlz SDK

A modern, customizable React component library for building beautiful feedback forms with dark mode support.

## Installation

Choose your preferred package manager:

```bash
# npm
npm install @mantlz/nextjs

# yarn
yarn add @mantlz/nextjs

# pnpm
pnpm add @mantlz/nextjs

# bun
bun add @mantlz/nextjs
```

## Usage

Wrap your application with the `MantlzProvider`:

```tsx
import { MantlzProvider } from "@mantlz/nextjs";

export default function Layout({ children }) {
  return (
    <MantlzProvider apiKey="your-mantlz-api-key">
      {children}
    </MantlzProvider>
  );
}
```

## FeedbackForm Component

The `FeedbackForm` component provides an easy way to collect user feedback with a star rating system and comments.

### Basic Usage

```tsx
import { FeedbackForm } from 'mantlz-sdk';

function MyFeedbackPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">We value your feedback</h1>
      
      <FeedbackForm 
        formId="my-feedback-form"
        onSubmitSuccess={(data) => console.log('Feedback submitted:', data)}
      />
    </div>
  );
}
```

### Customization Options

The FeedbackForm component offers two ways to customize its appearance:

#### 1. Simple Props

```tsx
<FeedbackForm
  formId="my-feedback-form"
  // Choose a preset theme
  theme="colorful"
  // Customize colors and styling
  primaryColor="blue"
  borderRadius="lg"
  fontSize="base"
  shadow="md"
  // Custom text
  submitButtonText="Send Your Feedback"
  feedbackPlaceholder="Tell us what you think about our product..."
  successMessage="Thanks for your valuable feedback!"
  // Force dark mode
  darkMode={true}
/>
```

#### 2. Advanced Appearance API

```tsx
<FeedbackForm
  formId="my-feedback-form"
  appearance={(theme) => ({
    baseStyle: {
      container: `bg-${theme === 'dark' ? 'zinc-900' : 'white'} p-6 rounded-xl shadow-lg`,
      form: 'space-y-6',
    },
    elements: {
      ratingWrapper: 'bg-transparent',
      starIcon: {
        filled: 'text-amber-400',
        empty: theme === 'dark' ? 'text-zinc-700' : 'text-zinc-300',
      },
      textarea: {
        input: theme === 'dark' 
          ? 'bg-zinc-800 border-zinc-700' 
          : 'bg-gray-50 border-gray-200',
      },
      submitButton: 'bg-blue-600 hover:bg-blue-700 text-white rounded-lg',
    },
    typography: {
      feedbackPlaceholder: "What do you think about our service?",
      submitButtonText: "Send",
    }
  })}
/>
```

### Preset Themes

The FeedbackForm component comes with several built-in themes:

- `minimal` - Clean, minimal design
- `rounded` - Soft, rounded corners
- `colorful` - Vibrant gradients and colors
- `glass` - Modern glassmorphism effect
- `retro` - Playful, retro-inspired design
- `flat` - Flat design with clear contrast

```tsx
import { FeedbackForm, FEEDBACK_THEMES } from 'mantlz-sdk';

// Use any of the preset themes
<FeedbackForm
  formId="my-form"
  theme={FEEDBACK_THEMES.GLASS}
/>
```

### Dark Mode Support

The FeedbackForm automatically detects the user's system preference for dark/light mode. You can also explicitly set the mode:

```tsx
<FeedbackForm
  formId="my-form"
  darkMode={true} // Force dark mode
/>
```

### Event Handlers

```tsx
<FeedbackForm
  formId="my-form"
  onSubmitSuccess={(data) => {
    // Handle successful submission
    console.log('Rating:', data.rating);
    console.log('Feedback:', data.feedback);
  }}
  onSubmitError={(error) => {
    // Handle submission error
    console.error('Submission failed:', error);
  }}
/>
```

## Contact Form

The ContactForm component provides a pre-styled contact form for collecting messages from users.

```tsx
import { ContactForm } from '@mantlz/nextjs';

export default function ContactPage() {
  return (
    <div className="container mx-auto p-4">
      <ContactForm 
        formId="your-form-id"
        title="Get in Touch"
        description="Have questions? We'd love to hear from you."
        customSubmitText="Send"
      />
    </div>
  );
}
```

### Preset Themes

ContactForm comes with four built-in themes you can use:

```tsx
import { ContactForm, CONTACT_THEMES } from '@mantlz/nextjs';

// Default light theme
<ContactForm formId="your-form-id" theme={CONTACT_THEMES.DEFAULT} />

// Dark theme
<ContactForm formId="your-form-id" theme={CONTACT_THEMES.DARK} />

// Shades of Purple theme
<ContactForm formId="your-form-id" theme={CONTACT_THEMES.PURPLE} />

// Neobrutalism theme
<ContactForm formId="your-form-id" theme={CONTACT_THEMES.NEOBRUTALISM} />
```

### Customizing Appearance

The appearance prop allows advanced customization similar to Clerk's approach:

```tsx
<ContactForm
  formId="your-form-id"
  appearance={{
    elements: {
      // Customize button style
      formButtonPrimary: 'bg-slate-500 hover:bg-slate-400 text-sm',
      // Customize input style
      input: 'bg-gray-100 border-gray-300',
      // Customize card style
      card: 'shadow-lg rounded-lg',
    },
  }}
/>
```

### New Flatter Appearance API

All form components (ContactForm, FeedbackForm, WaitlistForm) now support a flatter, more intuitive appearance API:

```tsx
<ContactForm
  formId="your-form-id"
  appearance={{
    // Direct container styling
    background: '#f8f9fa',
    border: '1px solid #dee2e6',
    
    // Button styling
    submitButton: 'bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md',
    
    // Input styling
    formInput: 'bg-white border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500',
    
    // Card styling
    card: 'shadow-lg rounded-xl p-6',
    cardTitle: 'text-xl font-bold text-gray-800',
    
    // Style mapping - you can use any of these aliases
    button: 'bg-indigo-600', // Aliases to submitButton/formButtonPrimary
    input: 'border-gray-300', // Generic input styling
    label: 'text-gray-700 font-medium', // Label styling
  }}
/>
```

You can also combine the flatter API with themes:

```tsx
<ContactForm
  formId="your-form-id"
  theme={CONTACT_THEMES.DARK}
  appearance={{
    // Override specific styles while keeping the theme
    submitButton: 'bg-purple-600 hover:bg-purple-700',
    formInput: 'border-purple-400 focus:ring-purple-500'
  }}
/>
```

### ContactForm Props

The ContactForm component accepts the following props:

| Prop | Type | Description |
|------|------|-------------|
| `formId` | `string` | **Required**. The ID of the form in your Mantlz dashboard. |
| `theme` | `'default' \| 'dark' \| 'purple' \| 'neobrutalism'` | The theme to use. Default: `'default'` |
| `appearance` | `object \| function` | Custom styles to apply to the form. |
| `customSubmitText` | `string` | Text for the submit button. Default: `'Send Message'` |
| `title` | `string` | Form title text. Default: `'Contact Us'` |
| `description` | `string` | Form description text. Default: `'Fill out the form below...'` |
| `className` | `string` | Additional CSS classes to apply to the form container. |
| `variant` | `'default' \| 'glass'` | Visual variant of the form. Default: `'default'` |
| `redirectUrl` | `string` | URL to redirect to after successful submission (paid plans only). |

For complete customization, you can also modify field labels and placeholders:

```tsx
<ContactForm
  formId="your-form-id"
  nameLabel="Full Name"
  namePlaceholder="John Doe"
  emailLabel="Email Address"
  emailPlaceholder="john@example.com"
  subjectLabel="Message Topic"
  subjectPlaceholder="Support Request"
  messageLabel="Your Message"
  messagePlaceholder="Tell us how we can help you..."
/>
```

## Customizing Form Appearance with Tailwind CSS

All form components (ContactForm, WaitlistForm, FeedbackForm) support full customization with Tailwind CSS classes through the `appearance` prop.

### Basic Style Customization

You can directly customize any form element using Tailwind CSS classes:

```tsx
<ContactForm
  formId="your-form-id"
  appearance={{
    elements: {
      // Primary button styling
      formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm',
      // Input styling
      input: 'bg-gray-50 border-gray-300 rounded-md focus:ring-blue-500',
      // Card styling
      card: 'shadow-xl rounded-xl border-0',
    }
  }}
/>
```

### Direct Background and Border Customization

You can directly set background and border styles:

```tsx
<WaitlistForm
  formId="your-form-id"
  appearance={{
    elements: {
      // Direct customizations
      background: 'bg-gradient-to-r from-blue-500 to-purple-600',
      border: 'border-2 border-indigo-300',
    }
  }}
/>
```

### Element Aliases for Easier Styling

You can use aliases for common elements, whichever is more intuitive:

```tsx
<FeedbackForm
  formId="your-form-id"
  appearance={{
    elements: {
      // Both work the same way
      submitButton: 'bg-green-500 hover:bg-green-600 text-white font-bold',
      // Instead of formButtonPrimary
      
      // Both work the same way
      formInput: 'bg-gray-100 border-gray-300',
      // Instead of input
    }
  }}
/>
```

### Combined Styling with Theme Selection

You can select a base theme and then override specific parts:

```tsx
<ContactForm
  formId="your-form-id"
  theme={CONTACT_THEMES.DARK}
  appearance={{
    baseStyle: {
      // Override container styles
      container: 'bg-gray-900 text-white',
    },
    elements: {
      // Add custom gradient to button
      formButtonPrimary: 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600',
      // Custom input styling
      input: 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400',
    }
  }}
/>
```

### Dynamic Styling Based on Theme

You can dynamically adjust styles based on the current theme:

```tsx
<WaitlistForm
  formId="your-form-id"
  theme={WAITLIST_THEMES.PURPLE}
  appearance={(theme) => ({
    elements: {
      // Customize based on theme
      card: theme === 'purple' 
        ? 'border-purple-400 bg-purple-900' 
        : theme === 'dark' 
          ? 'border-gray-700 bg-gray-900'
          : 'border-gray-200 bg-white',
      
      // Custom badge on card
      cardHeader: 'relative',
      cardTitle: 'flex items-center',
      // Add any custom styling
    }
  })}
/>
```

## Simplified Appearance API

All form components now support a more intuitive, flatter appearance API that makes styling easier:

```tsx
import { ContactForm, BASE_THEMES } from '@mantlz/nextjs';

<ContactForm
  formId="your-form-id"
  theme={BASE_THEMES.NEOBRUTALISM}
  appearance={{
    // Direct styling - no need for nested objects!
    container: 'bg-blue-100 border-4 border-black',
    button: 'bg-blue-500 text-black border-4 border-black',
    input: 'border-2 border-black',
    textarea: 'border-2 border-black',
    label: 'text-black font-bold',
    title: 'text-2xl font-black text-blue-900',
    
    // Text customization
    submitText: 'Send Message',
    placeholderText: 'Your message here...'
  }}
/>
```

### Built-in Themes

The SDK includes four pre-built themes that you can use:

```tsx
import { WaitlistForm, BASE_THEMES } from '@mantlz/nextjs';

// Available themes
<WaitlistForm theme={BASE_THEMES.DEFAULT} /> // Clean white design
<WaitlistForm theme={BASE_THEMES.DARK} /> // Dark mode focused
<WaitlistForm theme={BASE_THEMES.PURPLE} /> // Purple accents
<WaitlistForm theme={BASE_THEMES.NEOBRUTALISM} /> // Fun, cartoon-like UI
```

### Dynamic Appearance Based on Theme

You can dynamically adjust styles based on the current theme:

```tsx
<FeedbackForm
  formId="your-form-id"
  theme={BASE_THEMES.DARK}
  appearance={(theme) => ({
    // Styles can change based on theme
    container: theme === 'neobrutalism'
      ? 'bg-yellow-100 border-4 border-black'
      : 'bg-gray-900 border border-gray-800',
    
    button: theme === 'neobrutalism'
      ? 'bg-yellow-400 text-black border-4 border-black'
      : 'bg-blue-600 text-white'
  })}
/>
```

## Configuration Options

When creating a client, you can pass a configuration object with the following options:

```typescript
interface MantlzClientConfig {
  toastHandler?: ToastHandler;  // Custom toast handler
  notifications?: boolean;      // Enable/disable notifications (default: true)
  showApiKeyErrorToasts?: boolean;  // Show API key error toasts (default: false)
  apiUrl?: string;              // Custom API URL
  logger?: (message: string, ...args: any[]) => void;  // Custom logger function
  developmentMode?: boolean;    // Enable development mode for local testing
}
```

### Development Mode

When working in a local development environment, you may encounter CORS issues when making requests to the Mantlz API. To handle this, you can enable `developmentMode`:

```typescript
const client = createMantlzClient('your_api_key', {
  developmentMode: true  // Enable local development mode
});
```

In development mode:
- API requests use 'no-cors' mode to bypass CORS restrictions
- Mock data is returned for API responses
- Form submissions are simulated to work without actually submitting data

This allows you to develop and test your application locally without needing to configure CORS on the server side.

**Note:** Development mode should only be used for local testing and should be disabled in production.

## License

MIT 