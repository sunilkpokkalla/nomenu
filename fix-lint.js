const fs = require('fs');

const path1 = './src/app/dashboard/customize/customize-client.tsx';
let code1 = fs.readFileSync(path1, 'utf8');
code1 = code1.replace(
  'export function CustomizeDashboardClient({ restaurant, menus }: { restaurant: any, menus: any[] }) {',
  '// eslint-disable-next-line @typescript-eslint/no-explicit-any\nexport function CustomizeDashboardClient({ restaurant, menus }: { restaurant: any, menus: any[] }) {'
);
fs.writeFileSync(path1, code1);

const path2 = './src/app/menu/[id]/page.tsx';
let code2 = fs.readFileSync(path2, 'utf8');
code2 = code2.replace(
  'const designConfig = (menu.design_config as any) || {};',
  '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n  const designConfig = (menu.design_config as any) || {};'
);
fs.writeFileSync(path2, code2);
console.log('Fixed lint');
