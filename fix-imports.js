const fs = require('fs');

// Fix customize-client.tsx
const clientPath = './src/app/dashboard/customize/customize-client.tsx';
let clientCode = fs.readFileSync(clientPath, 'utf8');
clientCode = clientCode.replace(/import \{ Select, SelectContent, SelectItem, SelectTrigger, SelectValue \} from "@\/components\/ui\/select";\n/, "");
clientCode = clientCode.replace(/<Select value=\{selectedScope\} onValueChange=\{handleScopeChange\}>[\s\S]*?<\/Select>/, 
`<select
  value={selectedScope}
  onChange={(e) => handleScopeChange(e.target.value)}
  className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
>
  <option value="global" className="font-semibold">Global Default</option>
  {menus.map((menu) => (
    <option key={menu.id} value={menu.id}>
      Menu: {menu.name} {menu.design_config ? "(Custom)" : ""}
    </option>
  ))}
</select>`);
fs.writeFileSync(clientPath, clientCode);

// Fix branding-form.tsx
const formPath = './src/components/dashboard/branding-form.tsx';
let formCode = fs.readFileSync(formPath, 'utf8');
formCode = formCode.replace(/import \{ Switch \} from "@\/components\/ui\/switch";\n/, "");
formCode = formCode.replace(/<Switch[\s\S]*?\/>/, 
`<label className="relative inline-flex items-center cursor-pointer">
  <input 
    type="checkbox" 
    name="use_custom_design" 
    value="true" 
    className="sr-only peer"
    checked={useCustomDesign}
    onChange={(e) => setUseCustomDesign(e.target.checked)}
  />
  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
</label>`);
fs.writeFileSync(formPath, formCode);
console.log("Fixed imports");
