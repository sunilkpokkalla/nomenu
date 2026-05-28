const fs = require('fs');
const path = './src/components/dashboard/branding-form.tsx';
let code = fs.readFileSync(path, 'utf8');

const target = `{/* Gating Logic warning alert & premium upgrade CTA */}`;
const replacement = `</div>\n            {/* Gating Logic warning alert & premium upgrade CTA */}`;

code = code.replace(target, replacement);

fs.writeFileSync(path, code);
