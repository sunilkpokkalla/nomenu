const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Regex to match the owner_id query block
  const regex = /const \{\s*data:\s*restaurant[^}]*\}\s*=\s*await\s+supabase\s*\.from\(\s*["']restaurants["']\s*\)\s*\.select\(\s*["'][^"']*["']\s*\)\s*\.eq\(\s*["']owner_id["']\s*,\s*user\.id\s*\)\s*\.order\(\s*["']created_at["']\s*,\s*\{\s*ascending:\s*true\s*\}\s*\)\s*\.limit\(\s*1\s*\)\s*\.maybeSingle\(\s*\);/g;
  
  if (regex.test(content)) {
    console.log(`Updating ${filePath}`);
    
    // Add import if missing
    if (!content.includes('getActiveRestaurant')) {
      // Find the last import statement
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const nextLineIndex = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, nextLineIndex) + '\nimport { getActiveRestaurant, UserRole } from "@/lib/rbac";' + content.slice(nextLineIndex);
      } else {
        content = 'import { getActiveRestaurant, UserRole } from "@/lib/rbac";\n' + content;
      }
    }
    
    content = content.replace(regex, 'const restaurant = await getActiveRestaurant(supabase, user.id);');
    
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

walk('./src/app/dashboard');
