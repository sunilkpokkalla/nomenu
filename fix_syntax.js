const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'src/components/menu/themes');
const files = fs.readdirSync(themesDir).filter(f => f.endsWith('Theme.tsx'));

let fixedCount = 0;

for (const file of files) {
  const filepath = path.join(themesDir, file);
  let content = fs.readFileSync(filepath, 'utf8');
  
  if (content.includes('className= relative"')) {
    content = content.replace(/className=\s*relative"/g, 'className="relative ');
    fs.writeFileSync(filepath, content);
    console.log('Fixed', file);
    fixedCount++;
  }
}

console.log('Fixed syntax in', fixedCount, 'files');
