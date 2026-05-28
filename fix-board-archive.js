const fs = require('fs');

const path = './src/app/dashboard/orders/orders-board.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add Archive UI Banner
const archiveBanner = `
      {selectedDateStr && (
        <div className="bg-amber-100 border border-amber-200 text-amber-900 px-4 py-2 rounded-xl flex justify-center items-center font-semibold text-sm shadow-sm gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          Archive Mode: You are viewing orders from {selectedDateStr}. Modifying orders is disabled.
        </div>
      )}
`;

// Insert banner below HEADER
code = code.replace(/<div className=\{\`flex items-center justify-between \$\{isKdsMode \? "text-slate-100" : "text-slate-900"\}\`\}>[\s\S]*?<\/div>\s*\{\/\* Visual Notification Toast \*\/\}/, match => match + archiveBanner);


// 2. Disable Draggable
code = code.replace(/<Draggable key=\{order.id\} draggableId=\{order.id\} index=\{index\}>/, '<Draggable key={order.id} draggableId={order.id} index={index} isDragDisabled={!!selectedDateStr}>');


// 3. Hide Quick Action Buttons
const quickActionStart = '{/* Right Side: Quick Action Button';
const quickActionReplacement = `{/* Right Side: Quick Action Button */}
                                    {!selectedDateStr && (
                                      <div className="flex items-center gap-2 ml-auto">`;

// We have to close the wrapper as well.
// The easiest way is to wrap the content inside the right side div.
code = code.replace(
  /<div className="flex items-center gap-2 ml-auto">\s*\{col\.id === "pending" && \(/,
  `{!selectedDateStr && (
                                      <div className="flex items-center gap-2 ml-auto">
                                        {col.id === "pending" && (`
);

// Close the wrapper
code = code.replace(
  /<\/button>\s*\)\}\s*<\/div>\s*<\/div>/,
  `</button>
                                        )}
                                      </div>
                                    )}
                                  </div>`
);

fs.writeFileSync(path, code);
console.log('Fixed archive mode in orders-board');
