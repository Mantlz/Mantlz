const fs = require('fs');
const path = require('path');

// Create output directory if it doesn't exist
const outputDir = path.resolve(__dirname, 'src/styles');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create dist directory if it doesn't exist
const distDir = path.resolve(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Read the CSS file
try {
  const css = fs.readFileSync(path.resolve(__dirname, 'src/styles/index.css'), 'utf8');
  
  // Add a comment to indicate that this is processed CSS
  const processedCss = `/* Mantlz SDK - Pre-processed styles */\n${css}`;
  
  // Copy to processed.css for the build process
  fs.writeFileSync(path.resolve(__dirname, 'src/styles/processed.css'), processedCss);
  
  // Copy directly to dist for direct imports
  fs.writeFileSync(path.resolve(__dirname, 'dist/styles.css'), processedCss);
  
  console.log('CSS copied successfully to both src/styles/processed.css and dist/styles.css');
} catch (error) {
  console.error('Error processing CSS:', error);
} 