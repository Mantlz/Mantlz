const fs = require('fs');
const path = require('path');

const files = ['dist/index.js', 'dist/index.mjs'];

files.forEach(file => {
  const filePath = path.resolve(file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    fs.writeFileSync(filePath, "'use client';\n\n" + content);
    console.log(`Added 'use client' directive to ${file}`);
  }
}); 