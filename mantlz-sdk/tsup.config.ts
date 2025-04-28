import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';

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

// Function to inline the CSS directly into the build
const inlineCssPlugin = () => {
  return {
    name: 'inline-css-plugin',
    buildEnd: async () => {
      try {
        // Read the processed CSS file (created by the prebuild script)
        const cssPath = path.resolve('src/styles/processed.css');
        if (!fs.existsSync(cssPath)) {
          console.error('⚠️ Processed CSS file not found at:', cssPath);
          console.error('Make sure to run the prebuild script first');
          return;
        }
        
        console.log('✅ Found processed CSS file');
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        
        // Files to inject CSS into
        const files = ['dist/index.js', 'dist/index.mjs'];
        
        for (const file of files) {
          if (fs.existsSync(file)) {
            console.log(`Injecting CSS into ${file}...`);
            const content = fs.readFileSync(file, 'utf8');
            
            // Create a small script to inject CSS into the document head
            const injectCss = `
// Automatically inject styles
(function() {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.setAttribute('data-mantlz', 'true');
    style.textContent = ${JSON.stringify(cssContent)};
    
    // Only inject once
    if (!document.querySelector('style[data-mantlz="true"]')) {
      document.head.appendChild(style);
    }
  }
  
  // Set the CSS content as a global variable for development mode
  if (typeof window !== 'undefined') {
    window.__MANTLZ_CSS__ = ${JSON.stringify(cssContent)};
  }
})();
`;
            
            // Inject the CSS after the 'use client' directive
            const updatedContent = content.replace(/'use client';\n\n/, `'use client';\n\n${injectCss}\n\n`);
            fs.writeFileSync(file, updatedContent);
            console.log(`✅ CSS injected into ${file}`);
          } else {
            console.error(`⚠️ Output file not found: ${file}`);
          }
        }
      } catch (error) {
        console.error('⚠️ Error processing CSS:', error);
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
  external: ['react', 'next', 'zod'],
  esbuildOptions(options) {
    options.legalComments = 'inline';
    options.define = {
      ...options.define,
      'process.env.NODE_ENV': '"production"'
    };
  },
  plugins: [handleUseClientDirective(), inlineCssPlugin()],
});