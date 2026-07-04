"use client";

import { useState } from "react";
import { updateLoyaltyDesign } from "./actions";
import { 
  Loader2, Palette, Save, Sparkles,
  Star, Heart, Coffee, Pizza, Gift, Check, 
  Croissant, Utensils, IceCream, Wine, Cake, CupSoda,
  Soup, BadgePercent, ChefHat, Sandwich
} from "lucide-react";
import { LoyaltyCardUI } from "@/app/loyalty/[id]/loyalty-card-ui";

const STAMP_ICONS = [
  { id: "star", name: "Star", icon: Star },
  { id: "heart", name: "Heart", icon: Heart },
  { id: "coffee", name: "Coffee Cup", icon: Coffee },
  { id: "pizza", name: "Pizza Slice", icon: Pizza },
  { id: "gift", name: "Gift Box", icon: Gift },
  { id: "check", name: "Checkmark", icon: Check },
  { id: "croissant", name: "Croissant", icon: Croissant },
  { id: "utensils", name: "Utensils", icon: Utensils },
  { id: "icecream", name: "Ice Cream", icon: IceCream },
  { id: "wine", name: "Wine Glass", icon: Wine },
  { id: "cake", name: "Cake", icon: Cake },
  { id: "soda", name: "Soda", icon: CupSoda },
  { id: "bowl", name: "Bowl", icon: Soup },
  { id: "discount", name: "Discount", icon: BadgePercent },
  { id: "chef", name: "Chef", icon: ChefHat },
  { id: "sandwich", name: "Sandwich", icon: Sandwich },
];

const STAMP_COLORS = [
  { id: "red", name: "Spicy Red", class: "text-red-500", bgClass: "bg-red-500" },
  { id: "orange", name: "Citrus Orange", class: "text-orange-500", bgClass: "bg-orange-500" },
  { id: "amber", name: "Mustard Gold", class: "text-amber-500", bgClass: "bg-amber-500" },
  { id: "emerald", name: "Fresh Green", class: "text-emerald-500", bgClass: "bg-emerald-500" },
  { id: "blue", name: "Royal Blue", class: "text-blue-600", bgClass: "bg-blue-600" },
  { id: "indigo", name: "Deep Purple", class: "text-indigo-500", bgClass: "bg-indigo-500" },
  { id: "pink", name: "Berry Pink", class: "text-pink-500", bgClass: "bg-pink-500" },
  { id: "stone", name: "Coffee Bean", class: "text-stone-700", bgClass: "bg-stone-700" },
  { id: "slate", name: "Charcoal", class: "text-slate-800", bgClass: "bg-slate-800" },
  { id: "neutral", name: "Cream", class: "text-neutral-300", bgClass: "bg-neutral-300" },
];

const CARD_LAYOUTS = [
  { id: "classic", name: "Classic", preview: "bg-amber-100 border-2 border-amber-200" },
  { id: "digital", name: "Digital", preview: "bg-slate-900 border-2 border-slate-700 bg-gradient-to-br from-slate-800 to-black" },
  { id: "minimalist", name: "Minimalist", preview: "bg-white border-2 border-slate-200" },
  { id: "coffee", name: "Coffee", preview: "bg-[#e6d5c3] border-2 border-[#8b7355] border-dashed" },
  { id: "luxury", name: "Luxury", preview: "bg-black border-2 border-[#d4af37]" },
  { id: "gradient", name: "Gradient", preview: "bg-gradient-to-r from-purple-400 to-blue-400 border-0" },
  { id: "birthday", name: "Birthday Bash", preview: "bg-gradient-to-tr from-yellow-300 via-pink-400 to-purple-500 rounded-lg" },
  { id: "finedining", name: "Fine Dining", preview: "bg-white border-[1px] border-black/20" },
  { id: "corporate", name: "Corporate", preview: "bg-slate-800 border-l-4 border-blue-500" },
  { id: "botanical", name: "Botanical", preview: "bg-[#eef1e6] border-2 border-[#cbd5c0]" },
  { id: "holographic", name: "Holograph", preview: "bg-gradient-to-tr from-pink-200 via-blue-200 to-green-200" },
  { id: "chalkboard", name: "Chalkboard", preview: "bg-[#2b302c] border-4 border-[#4a3b32]" },
  { id: "lumia", name: "Lumia Black", preview: "bg-black border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]" },
  { id: "modernminimal", name: "Modern Minimal", preview: "bg-[#f9fafb] border border-slate-100" },
  { id: "vibrantcafe", name: "Vibrant Cafe", preview: "bg-orange-500 border-0 rounded-[1rem]" }
];

const PREVIEW_COLORS: Record<string, string> = {
  classic: "#f97316",
  digital: "#8b4513",
  minimalist: "#f97316",
  coffee: "#8b7355",
  luxury: "#d4af37",
  gradient: "#f97316",
  birthday: "#ec4899",
  finedining: "#000000",
  corporate: "#1e293b",
  botanical: "#84cc16",
  holographic: "#a855f7",
  chalkboard: "#ffffff",
  lumia: "#ffffff",
  modernminimal: "#f97316",
  vibrantcafe: "#ea580c"
};

interface Props {
  restaurantId: string;
  initialColor: string;
  initialIcon: string;
  initialLayout?: string;
  initialRewardText?: string | null;
  restaurantName: string;
  primaryColor: string;
  restaurantLogo?: string | null;
}

export function LoyaltyDesignEditor({
  restaurantId,
  initialColor,
  initialIcon,
  initialLayout = "classic",
  initialRewardText,
  restaurantName,
  primaryColor,
  restaurantLogo
}: Props) {
  const [color, setColor] = useState(initialColor);
  const [icon, setIcon] = useState(initialIcon);
  const [layout, setLayout] = useState(initialLayout);
  const [rewardText, setRewardText] = useState(initialRewardText || "10 Stamps = 1 Free Item");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleAIWriter = () => {
    const aiIdeas = [
      "10 Stamps = 1 VIP Mystery Gift",
      "Unlock a Secret Menu Item!",
      "10 Stamps = Free Lunch On Us",
      "Get 10, Claim Your Free Drink",
      "Earn 10 Stamps for 20% Off",
      "10 Stamps = Elite Status Perks"
    ];
    const random = aiIdeas[Math.floor(Math.random() * aiIdeas.length)];
    setRewardText(random);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await updateLoyaltyDesign(restaurantId, color, icon, layout, rewardText);
      if (res.success) {
        setMessage({ text: "Design saved successfully!", type: "success" });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (e) {
      setMessage({ text: "Failed to save design", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left: Controls */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Card Design</h3>
                <p className="text-slate-500 text-sm">Customize the look and feel of your customer's loyalty card.</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Reward Text Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Reward Text</label>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    maxLength={30}
                    value={rewardText}
                    onChange={(e) => setRewardText(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium transition-shadow"
                    placeholder="e.g. 10 Stamps = 1 Free Item"
                  />
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={handleAIWriter}
                      className="text-[11px] font-bold px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Writer
                    </button>
                    {[
                      "10 Stamps = 1 Free Coffee",
                      "Buy 9, Get 10th Free!",
                      "10 Stamps = 15% Off Your Bill",
                      "10 Stamps = Free Appetizer",
                      "10 Stamps = Free Dessert",
                      "Earn 10 Stamps for a Reward!",
                      "10 Stamps = Free Cocktail",
                      "10 Stamps = Free Lunch"
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setRewardText(suggestion)}
                        className="text-[10px] xl:text-[11px] font-semibold px-2 py-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition-colors truncate"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Layout Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Card Layout</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                  {CARD_LAYOUTS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setLayout(opt.id)}
                      title={opt.name}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all group ${
                        layout === opt.id
                          ? "border-indigo-600 bg-indigo-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="w-full aspect-[1.586/1] rounded-md shadow-sm mb-2 relative overflow-hidden bg-slate-100 pointer-events-none flex items-center justify-center">
                        <div className="w-[300px] origin-center" style={{ transform: 'scale(0.25)' }}>
                          <LoyaltyCardUI
                            cardId="preview-mini"
                            restaurantId="preview-mini"
                            stamps={3}
                            restaurantName={restaurantName}
                            primaryColor={PREVIEW_COLORS[opt.id] || primaryColor}
                            stampColor={color}
                            stampIcon={icon}
                            layout={opt.id}
                            rewardText={rewardText}
                            isPreviewMode={true}
                          />
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold text-center leading-tight ${layout === opt.id ? "text-indigo-700" : "text-slate-500 group-hover:text-slate-800"}`}>
                        {opt.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Stamp Icon</label>
                <div className="flex flex-wrap gap-3">
                  {STAMP_ICONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setIcon(opt.id)}
                      title={opt.name}
                      className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                        icon === opt.id
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                          : "border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <opt.icon className="w-6 h-6" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Stamp Color</label>
                <div className="flex flex-wrap gap-4">
                  {STAMP_COLORS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setColor(opt.id)}
                      title={opt.name}
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        color === opt.id
                          ? "ring-4 ring-offset-2 ring-indigo-600 scale-110 shadow-md"
                          : "ring-1 ring-slate-200 hover:scale-110 hover:shadow-md"
                      } ${opt.bgClass}`}
                    >
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Design Changes
            </button>
            
            {message && (
              <p className={`mt-3 text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-rose-600"}`}>
                {message.text}
              </p>
            )}
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="bg-slate-50 rounded-3xl p-6 md:p-10 border border-slate-100 flex flex-col items-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Live Customer Preview</p>
          <div className="w-full max-w-[400px] scale-90 sm:scale-100 origin-top">
            <div className="pointer-events-none">
              <LoyaltyCardUI
                cardId="preview-card"
                restaurantId={restaurantId}
                stamps={5}
                restaurantName={restaurantName}
                restaurantLogo={restaurantLogo}
                primaryColor={primaryColor}
                stampColor={color}
                stampIcon={icon}
                layout={layout}
                rewardText={rewardText}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
