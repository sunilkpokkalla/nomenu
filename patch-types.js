const fs = require('fs');
const path = './src/lib/supabase/database.types.ts';
let code = fs.readFileSync(path, 'utf8');

// The `menus` table is within `Tables` -> `menus` -> `Row`, `Insert`, `Update`

const newColumnsRow = `use_custom_design?: boolean | null
          theme_style?: string | null
          primary_color?: string | null
          accent_color?: string | null
          `;

code = code.replace(/Row: \{\s+id: string\s+restaurant_id: string\s+name: string\s+description\?: string \| null/g, 
  `Row: {\n          ${newColumnsRow}          id: string\n          restaurant_id: string\n          name: string\n          description?: string | null`);

code = code.replace(/Insert: \{\s+id\?: string\s+restaurant_id: string\s+name: string\s+description\?: string \| null/g, 
  `Insert: {\n          ${newColumnsRow}          id?: string\n          restaurant_id: string\n          name: string\n          description?: string | null`);

code = code.replace(/Update: \{\s+id\?: string\s+restaurant_id\?: string\s+name\?: string\s+description\?: string \| null/g, 
  `Update: {\n          ${newColumnsRow}          id?: string\n          restaurant_id?: string\n          name?: string\n          description?: string | null`);

fs.writeFileSync(path, code);
console.log('Patched types');
