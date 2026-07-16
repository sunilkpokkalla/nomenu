const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'src/components/menu/themes');
const files = fs.readdirSync(themesDir).filter(f => f.endsWith('Theme.tsx'));

let fixedCount = 0;

for (const file of files) {
  const filepath = path.join(themesDir, file);
  let content = fs.readFileSync(filepath, 'utf8');
  
  // Check if it has selectedItem modal pattern
  if (!content.includes('selectedItem && (')) continue;
  
  // Determine which setter is used
  const usesSetters = content.includes('setters.setSelectedItem');
  const setterCall = usesSetters ? 'setters.setSelectedItem(null)' : 'setSelectedItem(null)';
  
  // Regex to find the backdrop div
  const backdropRegex = /(<div\s+className="fixed inset-0[^"]*")>/g;
  
  let modified = false;
  
  content = content.replace(backdropRegex, (match, p1) => {
    // If it already has onClick, skip
    if (content.substring(content.indexOf(match), content.indexOf(match) + 200).includes('onClick=')) {
      return match;
    }
    modified = true;
    return `${p1} onClick={() => ${setterCall}}>`;
  });
  
  if (modified) {
    // Now we need to add onClick={(e) => e.stopPropagation()} to the inner modal container and relative
    // The inner container is typically the next div
    // Let's just use string replace on the common inner div classes
    
    // We can find the backdrop and then the next <div
    let parts = content.split('onClick={() => ' + setterCall + '}>');
    if (parts.length > 1) {
      let rest = parts[1];
      const nextDivMatch = rest.match(/(\s*<div\s+className="[^"]*)(")/);
      if (nextDivMatch) {
        let innerDivStart = nextDivMatch[0];
        let newInnerDivStart = innerDivStart;
        if (!newInnerDivStart.includes('relative')) {
          newInnerDivStart = newInnerDivStart.replace('"', ' relative"');
        }
        newInnerDivStart += ` onClick={(e) => e.stopPropagation()}`;
        
        parts[1] = rest.replace(innerDivStart, newInnerDivStart);
        content = parts.join(`onClick={() => ${setterCall}}>`);
      }
    }
    
    fs.writeFileSync(filepath, content);
    console.log('Fixed', file);
    fixedCount++;
  }
}

console.log('Fixed', fixedCount, 'files');
