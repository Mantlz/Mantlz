# Mantlz SDK

A modern, customizable React component library for building beautiful feedback forms with dark mode support.

## Installation

```bash
npm install mantlz-sdk
# or
yarn add mantlz-sdk
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

## License

MIT 