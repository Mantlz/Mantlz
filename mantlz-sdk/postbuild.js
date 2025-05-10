const fs = require('fs');
const path = require('path');

// Since our tsup plugin now handles the JS/MJS files, we only need to handle the .d.ts files here
const typeFiles = ['dist/index.d.ts', 'dist/index.d.mts'];

typeFiles.forEach(file => {
  const filePath = path.resolve(file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Only add 'use client' if it doesn't already exist
    if (!content.includes("'use client'") && !content.includes('"use client"')) {
      fs.writeFileSync(filePath, "'use client';\n\n" + content);
      // (`Added 'use client' directive to ${file}`);
    }
  }
}); 