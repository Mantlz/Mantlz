/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable preflight to prevent looking for external files
  },
  // Important to keep the classes even when not referenced directly
  safelist: [
    // Add classes that must be preserved in the production build
    'bg-white', 'dark:bg-zinc-900', 'text-gray-900', 'dark:text-white',
    // Input classes
    'border-input', 'ring-offset-background', 'placeholder:text-muted-foreground',
    // Form element classes
    'flex', 'flex-col', 'gap-2', 'mt-4', 'mb-4', 'rounded-md',
    // Button classes
    'bg-primary', 'text-primary-foreground', 'hover:bg-primary/90',
  ]
}; 