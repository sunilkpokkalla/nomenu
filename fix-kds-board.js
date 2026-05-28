const fs = require('fs');

const path = './src/app/dashboard/orders/orders-board.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Import ExternalLink
code = code.replace(/Maximize, Minimize, AlertTriangle \}/, 'Maximize, Minimize, AlertTriangle, ExternalLink }');

// 2. Add isStandalone to props
code = code.replace(
  /export function OrdersBoard\(\{ initialOrders, restaurantId, timezone, supabaseUrl, supabaseAnonKey \}: \{ initialOrders: Order\[\], restaurantId: string, timezone: string, supabaseUrl: string, supabaseAnonKey: string \}\) \{/,
  'export function OrdersBoard({ initialOrders, restaurantId, timezone, supabaseUrl, supabaseAnonKey, isStandalone = false }: { initialOrders: Order[], restaurantId: string, timezone: string, supabaseUrl: string, supabaseAnonKey: string, isStandalone?: boolean }) {'
);

// 3. Update isKdsMode initialization
code = code.replace(
  /const \[isKdsMode, setIsKdsMode\] = useState\(false\);/,
  'const [isKdsMode, setIsKdsMode] = useState(isStandalone);'
);

// 4. Update handleFullscreenChange
code = code.replace(
  /if \(!document\.fullscreenElement\) setIsKdsMode\(false\);/,
  'if (!document.fullscreenElement && !isStandalone) setIsKdsMode(false);'
);

// 5. Update toggleKdsMode
code = code.replace(
  /setIsKdsMode\(false\);\n    \}/,
  'setIsKdsMode(isStandalone);\n    }'
);

// 6. Add Pop-out button next to Fullscreen KDS
const fullscreenBtn = `<button \n            onClick={toggleKdsMode}`;
const popoutBtn = `{!isKdsMode && !isStandalone && (
            <button 
              onClick={() => window.open('/kds', 'KDS', 'width=1280,height=800,menubar=no,toolbar=no')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            >
              <ExternalLink className="w-4 h-4" />
              Pop-out KDS
            </button>
          )}
          <button 
            onClick={toggleKdsMode}`;

code = code.replace(fullscreenBtn, popoutBtn);

fs.writeFileSync(path, code);
console.log('Fixed OrdersBoard');
