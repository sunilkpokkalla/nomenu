const fs = require('fs');
const path = './src/app/dashboard/orders/orders-board.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove side effect from setOrders in fetchLatestOrders
code = code.replace(/setOrders\(prevOrders => \{[\s\S]*?\/\/ Return fresh data from server to guarantee sync\s*return nextOrders;\s*\}\);/, `setOrders(nextOrders);`);

// 2. Add knownOrderIds ref and the new useEffect for notifications
const refImportMatch = code.match(/const containerRef = useRef<HTMLDivElement>\(null\);/);
if (refImportMatch) {
  code = code.replace(/const containerRef = useRef<HTMLDivElement>\(null\);/, 
`const containerRef = useRef<HTMLDivElement>(null);
  const knownOrderIds = useRef<Set<string>>(new Set(initialOrders.map(o => o.id)));

  useEffect(() => {
    if (selectedDateStr) return; // Only notify on live "Today" view
    
    const newOrders = orders.filter(o => !knownOrderIds.current.has(o.id));
    
    if (newOrders.length > 0) {
      const latestNew = newOrders[newOrders.length - 1];
      
      // Don't play sound on initial mount if they were already there
      // Wait, initialOrders are already in knownOrderIds, so this only triggers on NEW orders arriving after mount.
      playNotificationSound();
      setNotification({
        id: latestNew.id,
        title: \`New Order #\${String(latestNew.daily_order_number || 0).padStart(3, '0')}\`,
        subtitle: latestNew.table_number ? \`Table \${latestNew.table_number}\` : (latestNew.customer_name || 'Anonymous')
      });
      
      setTimeout(() => setNotification(null), 6000);
      
      // Add to known IDs
      newOrders.forEach(o => knownOrderIds.current.add(o.id));
    }
  }, [orders, selectedDateStr]);`);
}

// 3. Remove side effect from WebSocket INSERT handler
code = code.replace(/if \(newOrder\) \{[\s\S]*?playNotificationSound\(\);[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?\}, 6000\);[\s\S]*?setOrders\(prev => \[\.\.\.prev, newOrder as Order\]\);[\s\S]*?\}/, 
`if (newOrder) {
              setOrders(prev => {
                // Prevent duplicate insertions if polling already grabbed it
                if (prev.some(o => o.id === newOrder.id)) return prev;
                return [...prev, newOrder as Order];
              });
            }`);

fs.writeFileSync(path, code);
console.log('Fixed orders-board side effects');
