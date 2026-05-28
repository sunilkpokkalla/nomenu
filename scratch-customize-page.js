const fs = require('fs');
const path = './src/app/dashboard/customize/page.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/<BrandingForm\s+restaurant=\{restaurant\}\s+action=\{updateBranding\}\s+\/>/, 
`<BrandingForm 
          entity={restaurant} 
          type="restaurant"
          action={updateBranding} 
        />`);

fs.writeFileSync(path, code);
console.log('Fixed customize page');
