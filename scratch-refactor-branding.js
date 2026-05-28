const fs = require('fs');
const path = './src/components/dashboard/branding-form.tsx';
let code = fs.readFileSync(path, 'utf8');

const oldProps = `interface BrandingFormProps {
  restaurant: {
    id: string;
    name: string;
    cuisine_type: string | null;
    primary_color: string | null;
    accent_color: string | null;
    theme_style: string | null;
    wifi_password: string | null;
    plan: string | null;
    address: string | null;
    phone: string | null;
  };
  action: (formData: FormData) => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
}`;

const newProps = `interface BrandingFormProps {
  entity: {
    id: string;
    name: string;
    cuisine_type?: string | null;
    primary_color?: string | null;
    accent_color?: string | null;
    theme_style?: string | null;
    wifi_password?: string | null;
    plan?: string | null;
    address?: string | null;
    phone?: string | null;
    // Menu specific
    use_custom_design?: boolean | null;
  };
  type: "restaurant" | "menu";
  action: (formData: FormData) => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
}`;

code = code.replace(oldProps, newProps);

const oldFunctionSig = `export function BrandingForm({ restaurant, action, successMessage, errorMessage }: BrandingFormProps) {
  const [primaryColor, setPrimaryColor] = useState(restaurant.primary_color || "#2563EB");
  const [accentColor, setAccentColor] = useState(restaurant.accent_color || "#F59E0B");
  const [themeStyle, setThemeStyle] = useState(restaurant.theme_style || "minimalist");
  const [wifiPassword, setWifiPassword] = useState(restaurant.wifi_password || "");`;

const newFunctionSig = `import { Switch } from "@/components/ui/switch";

export function BrandingForm({ entity, type, action, successMessage, errorMessage }: BrandingFormProps) {
  const [useCustomDesign, setUseCustomDesign] = useState(type === "menu" ? (entity.use_custom_design || false) : true);
  const [primaryColor, setPrimaryColor] = useState(entity.primary_color || "#2563EB");
  const [accentColor, setAccentColor] = useState(entity.accent_color || "#F59E0B");
  const [themeStyle, setThemeStyle] = useState(entity.theme_style || "minimalist");
  const [wifiPassword, setWifiPassword] = useState(entity.wifi_password || "");`;

code = code.replace(oldFunctionSig, newFunctionSig);

// Replace restaurant. references with entity. in the preview section
code = code.replace(/restaurant\./g, 'entity.');

// Now add the Switch inside the form
const oldFormStart = `<form onSubmit={handleSubmit} className="space-y-6">`;
const newFormStart = `<form onSubmit={handleSubmit} className="space-y-6">
            {type === "menu" && (
              <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
                <div className="space-y-0.5">
                  <Label className="text-base">Override Global Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Use a custom design specifically for this menu.
                  </p>
                </div>
                <Switch 
                  name="use_custom_design"
                  checked={useCustomDesign} 
                  onCheckedChange={setUseCustomDesign} 
                  value="true"
                />
              </div>
            )}

            <div className={type === "menu" && !useCustomDesign ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>`;

code = code.replace(oldFormStart, newFormStart);

// At the end of the form, close the div
const oldFormEnd = `            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </form>`;
const newFormEnd = `            </div>
            
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </form>`;

code = code.replace(oldFormEnd, newFormEnd);

// Hide wifi section if type is menu
const oldWifi = `<div className="space-y-2">
                <Label htmlFor="wifi_password" className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" /> Guest WiFi Password (Optional)
                </Label>`;
const newWifi = `{type === "restaurant" && (
              <div className="space-y-2">
                <Label htmlFor="wifi_password" className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" /> Guest WiFi Password (Optional)
                </Label>`;

code = code.replace(oldWifi, newWifi);
// Close the wifi div
const oldWifiClose = `                />
                <p className="text-xs text-muted-foreground">
                  Displays on your digital menu if provided.
                </p>
              </div>`;
const newWifiClose = `                />
                <p className="text-xs text-muted-foreground">
                  Displays on your digital menu if provided.
                </p>
              </div>
            )}`;

code = code.replace(oldWifiClose, newWifiClose);


fs.writeFileSync(path, code);
console.log('Refactored BrandingForm');
