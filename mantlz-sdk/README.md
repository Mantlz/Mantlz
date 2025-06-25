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

## Quick Start

```tsx
import { Mantlz } from '@mantlz/nextjs';

function App() {
  return (
    <Mantlz
      formId="your-form-id"
      }}
    />
  );
}


## Theming and Customization

Mantlz SDK comes with built-in themes and customization options. You can easily change the appearance of your forms, including background colors and styles.

```tsx
// Using a built-in theme
import { Mantlz } from '@mantlz/nextjs';

function App() {
  return (
    <Mantlz
      formId="your-form-id"
      theme="neobrutalism" // Options: default, modern, neobrutalism, simple
    />
  );
}
```

## Documentation

For detailed documentation, examples, and API reference, visit:

[https://docs.mantlz.app](https://docs.mantlz.app)

Features covered in documentation:
- Form Configuration
- Field Types & Validation
- File Uploads
- Analytics & Tracking
- Themes & Customization
- API Reference

## License

MIT