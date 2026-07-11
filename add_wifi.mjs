import fs from "fs";
import path from "path";

const themesDir = "src/components/menu/themes";
const files = [
  "BistroTheme.tsx",
  "BotanicalTheme.tsx",
  "BoutiqueTheme.tsx",
  "ClassicTheme.tsx",
  "EditorialTheme.tsx",
  "LoungeTheme.tsx",
  "LuxuryTheme.tsx",
  "MinimalistTheme.tsx",
  "OmakaseTheme.tsx",
  "PopDinerTheme.tsx",
  "ResortTheme.tsx",
  "VibrantTheme.tsx"
];

for (const file of files) {
  const filePath = path.join(themesDir, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, "utf-8");
  
  // 1. Add Wifi to lucide-react imports if not present
  if (!content.includes(" Wifi,") && !content.includes(", Wifi") && !content.includes("{ Wifi }")) {
    content = content.replace(/import \{([^}]+)\} from "lucide-react";/, (match, p1) => {
      return `import {${p1}, Wifi } from "lucide-react";`;
    });
  }
  
  // 2. Add Wifi rendering into the header right after cuisine_type
  // Most headers have {restaurant.cuisine_type ... } </p> or similar. We can look for </header> and insert just before it.
  if (!content.includes("restaurant.wifi_password")) {
    const wifiBlock = `
        {restaurant.wifi_password && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm opacity-80 font-sans tracking-wide">
            <Wifi className="w-4 h-4" /> <span>{restaurant.wifi_password}</span>
          </div>
        )}
`;
    // Insert just before the closing header tag, or at the end of the header section
    content = content.replace(/<\/header>/, `${wifiBlock}      </header>`);
  }
  
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Updated ${file}`);
}
