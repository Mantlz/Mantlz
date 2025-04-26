const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

// Create output directory if it doesn't exist
const outputDir = path.resolve(__dirname, 'src/styles');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read the CSS file
const css = fs.readFileSync(path.resolve(__dirname, 'src/styles/index.css'), 'utf8');

// Use a simplified approach for now - just copy the CSS without processing
fs.writeFileSync(path.resolve(__dirname, 'src/styles/processed.css'), css);
console.log('CSS copied successfully');

// Process the CSS
// postcss([tailwindcss, autoprefixer])
//   .process(css, { from: 'src/styles/index.css', to: 'src/styles/processed.css' })
//   .then(result => {
//     fs.writeFileSync(path.resolve(__dirname, 'src/styles/processed.css'), result.css);
//     console.log('CSS processed successfully');
//   })
//   .catch(error => {
//     console.error('Error processing CSS:', error);
//   }); 