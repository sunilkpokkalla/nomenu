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
  { id: "coffee", name: "Coffee", preview: "bg-[#e6d5c3] border-2 border-[#8b7355] border-dashed" },
  { id: "luxury", name: "Luxury", preview: "bg-black border-2 border-[#d4af37]" },
  { id: "gradient", name: "Gradient", preview: "bg-gradient-to-r from-purple-400 to-blue-400 border-0" },
  { id: "birthday", name: "Birthday Bash", preview: "bg-gradient-to-tr from-yellow-300 via-pink-400 to-purple-500 rounded-lg" },
  { id: "finedining", name: "Fine Dining", preview: "bg-white border-[1px] border-black/20" },
  { id: "corporate", name: "Corporate", preview: "bg-slate-800 border-l-4 border-blue-500" },
  { id: "botanical", name: "Botanical", preview: "bg-[#eef1e6] border-2 border-[#cbd5c0]" },
  { id: "holographic", name: "Holograph", preview: "bg-gradient-to-tr from-pink-200 via-blue-200 to-green-200" },
  { id: "chalkboard", name: "Chalkboard", preview: "bg-[#2b302c] border-4 border-[#4a3b32]" },
  { id: "lumia", name: "Lumia Black", preview: "bg-black border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]" }
];

const PREVIEW_COLORS: Record<string, string> = {
  classic: "#f97316",
  digital: "#8b4513",
  coffee: "#8b7355",
  luxury: "#d4af37",
  gradient: "#f97316",
  birthday: "#ec4899",
  finedining: "#000000",
  corporate: "#1e293b",
  botanical: "#84cc16",
  holographic: "#a855f7",
  chalkboard: "#ffffff",
  lumia: "#ffffff"
};

interface Props {
  restaurantId: string;
  initialColor: string;
  initialIcon: string;
  initialLayout?: string;
  initialRewardText?: string | null;
  initialCardColor?: string | null;
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
  initialCardColor,
  restaurantName,
  primaryColor,
  restaurantLogo
}: Props) {
  const [color, setColor] = useState(initialColor);
  const [icon, setIcon] = useState(initialIcon);
  const [layout, setLayout] = useState(() => 
    CARD_LAYOUTS.some(l => l.id === initialLayout) ? initialLayout : "classic"
  );
  const [rewardText, setRewardText] = useState(initialRewardText || "10 Stamps = 1 Free Item");
  const [cardColor, setCardColor] = useState(initialCardColor || primaryColor);
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
      const res = await updateLoyaltyDesign(restaurantId, color, icon, layout, rewardText, cardColor);
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
    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 lg:p-10 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-md">
            <Palette className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Card Design</h3>
            <p className="text-slate-500 mt-1">Sculpt the perfect loyalty card experience.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-sm sm:mr-2">
            <div className="flex items-center gap-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Card Color</div>
              <div className="relative">
                <input 
                  type="color" 
                  value={cardColor}
                  onChange={(e) => setCardColor(e.target.value)}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
                <div 
                  className="w-8 h-8 rounded-full border border-slate-200 shadow-inner flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                  style={{ backgroundColor: cardColor }}
                />
              </div>
            </div>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stamp Color</div>
              <div className="relative">
                <input 
                  type="color" 
                  value={color?.startsWith('#') ? color : '#64748b'}
                  onChange={(e) => setColor(e.target.value)}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
                <div 
                  className="w-8 h-8 rounded-full border border-slate-200 shadow-inner flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                  style={{ backgroundColor: color?.startsWith('#') ? color : '#64748b' }}
                />
              </div>
            </div>
          </div>
          {message && (
            <div className={`px-4 py-2 rounded-xl text-sm font-bold ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {message.text}
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-md flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Publish
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.2fr_1fr] gap-12 items-start">
        {/* Left: Controls */}
        <div className="space-y-8">
          
          {/* Section 1: Reward Text */}
          <div className="bg-slate-50/50 border border-slate-200/60 rounded-3xl p-5 lg:p-6">
            <div className="mb-5">
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Reward Text
              </h4>
              <p className="text-sm text-slate-500 mt-1">What does the customer get when they fill the card?</p>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  maxLength={30}
                  value={rewardText}
                  onChange={(e) => setRewardText(e.target.value)}
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 outline-none text-base font-medium transition-all shadow-sm"
                  placeholder="e.g. 10 Stamps = 1 Free Item"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleAIWriter}
                  className="text-xs font-bold px-4 py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Magic
                </button>
                {[
                  "Buy 9, Get 10th Free!",
                  "10 Stamps = 15% Off",
                  "Earn 10 Stamps for a Reward!",
                  "10 Stamps = Free Lunch"
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setRewardText(suggestion)}
                    className="text-xs font-semibold px-4 py-2.5 rounded-full bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Card Layout */}
          <div className="bg-slate-50/50 border border-slate-200/60 rounded-3xl p-5 lg:p-6">
            <div className="mb-6">
              <h4 className="text-lg font-bold text-slate-900">Architecture & Layout</h4>
              <p className="text-sm text-slate-500 mt-1">Select the structural foundation of your loyalty card.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {CARD_LAYOUTS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setLayout(opt.id)}
                  title={opt.name}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all group ${
                    layout === opt.id
                      ? "border-slate-900 bg-white ring-4 ring-slate-900/10 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                  }`}
                >
                  <div className="w-full aspect-[1.586/1] rounded-xl shadow-sm mb-3 relative overflow-hidden bg-slate-100 pointer-events-none">
                    <svg viewBox="0 0 640 403" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
                      <foreignObject width="640" height="403">
                        <div className="w-[640px] h-[403px] p-4 flex items-center justify-center">
                          <LoyaltyCardUI
                            cardId="preview-mini"
                            restaurantId="preview-mini"
                            stamps={3}
                            restaurantName="BRAND"
                            primaryColor={primaryColor}
                            stampColor={color}
                            stampIcon={icon}
                            layout={opt.id}
                            rewardText="REWARDS"
                            cardColor={cardColor}
                            isPreviewMode={true}
                          />
                        </div>
                      </foreignObject>
                    </svg>
                  </div>
                  <span className={`text-xs font-bold text-center leading-tight ${layout === opt.id ? "text-slate-900" : "text-slate-500 group-hover:text-slate-900"}`}>
                    {opt.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Stamp Aesthetics */}
          <div className="bg-slate-50/50 border border-slate-200/60 rounded-3xl p-5 lg:p-6">
            
            {/* Icon Selection */}
            <div>
              <div className="mb-4">
                <h4 className="text-lg font-bold text-slate-900">Stamp Iconography</h4>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {STAMP_ICONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setIcon(opt.id)}
                    title={opt.name}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${
                      icon === opt.id
                        ? "border-slate-900 bg-slate-900 text-white shadow-md scale-105"
                        : "border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <opt.icon className="w-6 h-6" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="xl:sticky xl:top-8 bg-slate-50 border border-slate-200/60 rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center justify-center min-h-[600px] shadow-inner">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full mb-10 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Preview</p>
          </div>
          
          <div className="w-full max-w-[400px] transition-all duration-500">
            <div className="pointer-events-none drop-shadow-2xl">
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
                cardColor={cardColor}
                isPreviewMode={true}
              />
            </div>
          </div>
          
          <p className="mt-12 text-sm text-slate-400 font-medium text-center max-w-xs">
            This is exactly how your customers will see their loyalty card in their digital wallet.
          </p>
        </div>
      </div>
    </div>
  );
}
