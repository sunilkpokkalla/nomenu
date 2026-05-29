const fs = require('fs');
const path = require('path');

const directories = [
  'src/components/menu/themes',
  'src/components/dashboard',
  'src/app/login'
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip if it doesn't contain <img
  if (!content.includes('<img') && !content.includes('<img ')) return;

  // Add Next.js Image import if not present
  if (!content.includes('import Image from "next/image"')) {
    // Find the last import statement or the beginning of the file
    let importMatch = content.match(/import .* from .*;/g);
    if (importMatch) {
      let lastImport = importMatch[importMatch.length - 1];
      content = content.replace(lastImport, `${lastImport}\nimport Image from "next/image";`);
    } else {
      // Just put it after use client if it exists, else top
      if (content.includes('"use client";')) {
        content = content.replace('"use client";', '"use client";\n\nimport Image from "next/image";');
      } else {
        content = `import Image from "next/image";\n` + content;
      }
    }
  }

  // Replace <img ... /> with <Image ... fill />
  // We need to carefully replace w-full and h-full with fill or just leave them and add fill
  // <img src="..." alt="..." className="..." /> -> <Image src="..." alt="..." className="..." fill />
  
  // It's safer to just replace <img with <Image and add fill just before />
  // Note: this assumes the parent container is relative or we add sizes. 
  // Let's add fill explicitly
  
  // Regex to match <img ... /> or <img ...>
  // We'll replace '<img ' with '<Image ' and ensure it has 'fill ' before the closing tag.
  // Sometimes it spans multiple lines.
  
  content = content.replace(/<img\b([^>]*?)(\/?)>/g, (match, attrs, slash) => {
    // If it already has fill, width, or height, don't add fill
    let hasSize = /fill\b|width=|height=/.test(attrs);
    
    // In qr-templates, we might need crossOrigin, which Next.js Image doesn't support directly without unoptimized
    if (attrs.includes('crossOrigin')) {
      return match; // Skip this one for Next.js Image, or use unoptimized
    }

    if (!hasSize) {
      // add fill
      return `<Image${attrs}fill ${slash ? '/' : ''}>`;
    }
    
    return `<Image${attrs}${slash ? '/' : ''}>`;
  });

  // Also replace w-full h-full from className if it has fill, but it's safe to just leave them.

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${filePath}`);
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

for (const dir of directories) {
  walkDir(dir);
}
