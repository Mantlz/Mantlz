import { defineConfig } from 'tsup';
import fs from 'fs';


// Function to handle 'use client' directive after build
const handleUseClientDirective = () => {
  return {
    name: 'handle-use-client-directive',
    buildEnd: async () => {
      const files = ['dist/index.js', 'dist/index.mjs'];
      
      for (const file of files) {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          // Remove any existing 'use client' directives
          const cleanContent = content.replace(/'use client';?\n*/g, '');
          // Add a single 'use client' directive at the top
          const updatedContent = `'use client';\n\n${cleanContent}`;
          fs.writeFileSync(file, updatedContent);
        }
      }
    },
  };
};

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  external: [
    'react',
    'next',
    'zod',
    '@radix-ui/themes',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-form',
    '@radix-ui/react-icons',
    '@radix-ui/react-label',
    '@radix-ui/react-progress',
    '@radix-ui/react-radio-group',
    '@radix-ui/react-select'
  ],
  esbuildOptions(options) {
    options.legalComments = 'inline';
    options.minifyIdentifiers = true;
    options.minifySyntax = true;
    options.minifyWhitespace = true;
    options.define = {
      ...options.define,
      'process.env.NODE_ENV': '"production"'
    };
  },
  plugins: [handleUseClientDirective()],
});