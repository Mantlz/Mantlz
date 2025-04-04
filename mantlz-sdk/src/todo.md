# Mantlz SDK: Form Redirect Feature

## Overview

The Mantlz SDK automatically redirects users after form submission:

- **Free Users**: Always redirected to Mantlz's hosted thank-you page
- **Paid Users** (STANDARD/PRO): Can specify custom redirect URLs or use the default Mantlz thank-you page

## Implementation

### Basic Usage

Free users are automatically redirected to Mantlz's hosted thank-you page:

```jsx
// Free user form (uses Mantlz's hosted thank-you page)
<FeedbackForm 
  formId="customer-feedback"
/>
```

### Custom Redirect (STANDARD/PRO plans only)

Paid users can specify a custom redirect URL to their own thank-you page:

```jsx
// Paid user form with custom redirect
<FeedbackForm 
  formId="customer-feedback"
  redirectUrl="/thank-you"  // Redirects to your custom page
/>
```

## How It Works

1. After form submission, the server checks the user's plan
2. If a redirectUrl is provided and the user is on a STANDARD or PRO plan, they're redirected to their custom URL
3. Otherwise, all users get redirected to the Mantlz hosted thank-you page
4. Free users who try to use a custom redirectUrl will see a toast message explaining that it's a premium feature

## Example Usage

### Example 1: Default Redirect (Free Users)

```jsx
import { FeedbackForm } from 'mantlz-sdk';

export default function FeedbackPage() {
  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Share Your Feedback</h1>
      
      <FeedbackForm 
        formId="customer-feedback"
        // No redirectUrl specified - will use Mantlz's hosted thank-you page
      />
    </div>
  );
}
```

### Example 2: Custom Redirect (Paid Users)

```jsx
import { FeedbackForm } from 'mantlz-sdk';

export default function FeedbackPage() {
  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Share Your Feedback</h1>
      
      <FeedbackForm 
        formId="customer-feedback"
        redirectUrl="/thank-you"  // Custom branded thank-you page
      />
    </div>
  );
}
```

### Example Custom Thank-You Page

```jsx
// pages/thank-you.js or app/thank-you/page.tsx
export default function ThankYouPage() {
  return (
    <div className="max-w-md mx-auto py-16 text-center">
      <img src="/your-logo.svg" alt="Your Company" className="mx-auto mb-6 h-10" />
      
      <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
      
      <p className="text-lg mb-6">
        We've received your feedback and appreciate your input.
      </p>
      
      <div className="bg-green-50 border border-green-100 rounded-lg p-6 mb-8">
        <p className="text-green-800">
          Our team will review your submission and may reach out if needed.
        </p>
      </div>
      
      <a 
        href="/" 
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Return to Home
      </a>
    </div>
  );
}
```

## Technical Implementation

1. Added a `redirectUrl` prop to form components
2. After successful form submission, the server:
   - Checks if the user is on a paid plan (STANDARD/PRO)
   - If yes and they provided a redirectUrl, redirects to that URL
   - Otherwise, redirects to the default Mantlz thank-you page with Mantlz branding
3. Implemented client-side toast messages to explain feature limitations to free users

## Status

✅ Feature implemented