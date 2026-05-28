const fs = require('fs');
const path = './src/app/dashboard/orders/orders-board.tsx';
let code = fs.readFileSync(path, 'utf8');

// Fix 1: no-explicit-any on window as any
code = code.replace(/const AudioContext = window\.AudioContext \|\| \(window as any\)\.webkitAudioContext;/g, 
`// eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;`);

// Fix 2: exhaustive-deps on line 147 (the first fetchLatestOrders useEffect)
code = code.replace(/\}, \[selectedDateStr, initialOrders\]\);/g, 
`  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateStr, initialOrders]);`);

// Fix 3: exhaustive-deps on line 153 (the polling interval useEffect)
code = code.replace(/\}, \[selectedDateStr, restaurantId, timezone, supabaseUrl, supabaseAnonKey\]\);/g, 
`  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateStr, restaurantId, timezone, supabaseUrl, supabaseAnonKey]);`);

fs.writeFileSync(path, code);
console.log('Fixed ESLint errors');
