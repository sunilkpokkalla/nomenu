const fs = require('fs');
const path = './src/app/loyalty/[id]/layouts.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Minimalist Grid
content = content.replace(
  '<h2 className="text-slate-900 font-bold text-2xl tracking-tight">{restaurantName}</h2>',
  '<div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Loyalty Card</div>\n            <h2 className="text-slate-900 font-bold text-2xl tracking-tight">{restaurantName}</h2>'
);

// 2. Coffee House
content = content.replace(
  '<h2 className="text-[#4a3b32] font-serif italic text-2xl sm:text-3xl truncate">{restaurantName}</h2>',
  '<div className="text-[#8b7355] text-[10px] font-bold uppercase tracking-widest mb-1">Loyalty Card</div>\n          <h2 className="text-[#4a3b32] font-serif italic text-2xl sm:text-3xl truncate">{restaurantName}</h2>'
);

// 3. Luxury Gold
content = content.replace(
  '<h2 className="text-[#d4af37] font-serif text-2xl sm:text-3xl tracking-widest uppercase">{restaurantName}</h2>',
  '<div className="text-[#d4af37]/60 text-[10px] font-bold uppercase tracking-widest mb-2">Loyalty Card</div>\n          <h2 className="text-[#d4af37] font-serif text-2xl sm:text-3xl tracking-widest uppercase">{restaurantName}</h2>'
);

// 4. Gradient
content = content.replace(
  '<h2 className="text-slate-800 font-bold text-2xl tracking-tighter">{restaurantName}</h2>',
  '<div>\n            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Loyalty Card</div>\n            <h2 className="text-slate-800 font-bold text-2xl tracking-tighter">{restaurantName}</h2>\n          </div>'
);

// 5. Bento Grid
content = content.replace(
  '<h2 className="text-slate-900 font-bold text-lg tracking-tight truncate">{restaurantName}</h2>',
  '<div className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-1">Loyalty Card</div>\n          <h2 className="text-slate-900 font-bold text-lg tracking-tight truncate">{restaurantName}</h2>'
);

// 6. Fine Dining
content = content.replace(
  '<h2 className="text-slate-900 font-serif text-2xl tracking-[0.2em] uppercase">{restaurantName}</h2>',
  '<div className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em] mb-2">Loyalty Card</div>\n        <h2 className="text-slate-900 font-serif text-2xl tracking-[0.2em] uppercase">{restaurantName}</h2>'
);

// 7. Corporate
content = content.replace(
  '<h2 className="text-white font-semibold text-xl tracking-wide leading-tight">{restaurantName}</h2>',
  '<div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Loyalty Card</div>\n        <h2 className="text-white font-semibold text-xl tracking-wide leading-tight">{restaurantName}</h2>'
);

// 8. Botanical
content = content.replace(
  '<h2 className="text-[#556b2f] font-serif text-3xl tracking-wide">{restaurantName}</h2>',
  '<div className="text-[#8fbc8f] text-[10px] font-bold uppercase tracking-widest mb-1">Loyalty Card</div>\n        <h2 className="text-[#556b2f] font-serif text-3xl tracking-wide">{restaurantName}</h2>'
);

// 9. Holographic
content = content.replace(
  '<h2 className="text-slate-800 font-black text-2xl tracking-tighter uppercase drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)] text-center">{restaurantName}</h2>',
  '<div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 text-center">Loyalty Card</div>\n        <h2 className="text-slate-800 font-black text-2xl tracking-tighter uppercase drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)] text-center">{restaurantName}</h2>'
);

// 10. Chalkboard
content = content.replace(
  '<h2 className="text-white font-mono text-2xl uppercase tracking-widest opacity-90 truncate">{restaurantName}</h2>',
  '<div className="text-white/50 text-[10px] font-mono uppercase tracking-widest mb-1">Loyalty Card</div>\n        <h2 className="text-white font-mono text-2xl uppercase tracking-widest opacity-90 truncate">{restaurantName}</h2>'
);

// 11. Lumia Black
content = content.replace(
  '<h2 className="text-white font-light text-2xl tracking-[0.15em] truncate">{restaurantName}</h2>',
  '<div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Loyalty Card</div>\n        <h2 className="text-white font-light text-2xl tracking-[0.15em] truncate">{restaurantName}</h2>'
);

// 12. Modern Minimal
content = content.replace(
  '<h2 className="text-slate-800 font-semibold text-xl tracking-tight truncate">{restaurantName}</h2>',
  '<div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Loyalty Card</div>\n          <h2 className="text-slate-800 font-semibold text-xl tracking-tight truncate">{restaurantName}</h2>'
);

// 13. Vibrant Cafe
content = content.replace(
  '<h2 className="text-white font-black text-3xl tracking-tight truncate drop-shadow-sm">{restaurantName}</h2>',
  '<div className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-1">Loyalty Card</div>\n          <h2 className="text-white font-black text-3xl tracking-tight truncate drop-shadow-sm">{restaurantName}</h2>'
);

fs.writeFileSync(path, content, 'utf8');
console.log("Layouts updated successfully.");
