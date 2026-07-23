"use client";
// Force re-render for Next.js Fast Refresh
import { useState } from "react";
import { 
  Star, Heart, Coffee, Pizza, Gift, Check, PartyPopper, Lock, CheckCircle2,
  Croissant, Utensils, IceCream, Wine, Cake, CupSoda,
  Soup, BadgePercent, ChefHat, Sandwich, Loader2
} from "lucide-react";
import * as Layouts from "./layouts";
import { Button } from "@/components/ui/button";

interface LoyaltyCardUIProps {
  cardId: string;
  restaurantId: string;
  stamps: number;
  restaurantName: string;
  restaurantLogo?: string | null;
  primaryColor: string;
  stampColor?: string;
  stampIcon?: string;
  layout?: string;
  rewardText?: string | null;
  isPreviewMode?: boolean;
  hasPhoneNumber?: boolean;
  activeReward?: string | null;
  cardColor?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rewardTemplates?: any[] | null;
  redeemedCycles?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  milestoneRewards?: any[] | null;
}

export function LoyaltyCardUI({ 
  cardId, restaurantId, stamps: initialStamps, restaurantName, primaryColor, restaurantLogo, 
  stampColor = "amber", stampIcon = "star", layout = "classic", rewardText = "10 Stamps = 1 Free Item", isPreviewMode = false,
  hasPhoneNumber = true, activeReward = null, cardColor, rewardTemplates, redeemedCycles = 0, milestoneRewards
}: LoyaltyCardUIProps) {
  const [stamps, setStamps] = useState(initialStamps);
  const [isLinked, setIsLinked] = useState(hasPhoneNumber);
  const [isLinking, setIsLinking] = useState(false);
  const [phoneToLink, setPhoneToLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [currentActiveReward, setCurrentActiveReward] = useState(activeReward);
  const [isClaimingReward, setIsClaimingReward] = useState(false);
  const [confirmClaim, setConfirmClaim] = useState(false);
  
  // New cycle logic
  const [currentStamps, setCurrentStamps] = useState(initialStamps);
  const [currentCycles, setCurrentCycles] = useState(redeemedCycles);

  const isFull = currentStamps >= 10;
  
  // Determine which template to show based on the current cycle
  let cycleRewardText = rewardText;
  if (rewardTemplates && rewardTemplates.length > 0) {
    const cycleIndex = currentCycles % rewardTemplates.length;
    cycleRewardText = rewardTemplates[cycleIndex].value || rewardText;
  }

  // Milestone logic
  const lifetimeVisits = (currentCycles * 10) + currentStamps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let activeMilestone: any = null;
  if (isFull && milestoneRewards && milestoneRewards.length > 0) {
    // Only trigger if they actually reached the exact milestone 
    // e.g. lifetimeVisits === 100
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    activeMilestone = milestoneRewards.find((m: any) => m.visits === lifetimeVisits);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ICONS: Record<string, any> = {
    star: Star,
    heart: Heart,
    coffee: Coffee,
    pizza: Pizza,
    gift: Gift,
    check: Check,
    croissant: Croissant,
    utensils: Utensils,
    icecream: IceCream,
    wine: Wine,
    cake: Cake,
    soda: CupSoda,
    bowl: Soup,
    discount: BadgePercent,
    chef: ChefHat,
    sandwich: Sandwich
  };

  const COLORS: Record<string, { bg: string, text: string }> = {
    amber: { bg: "bg-amber-100", text: "text-amber-500 fill-amber-500" },
    rose: { bg: "bg-rose-100", text: "text-rose-400 fill-rose-400" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-500 fill-emerald-500" },
    sky: { bg: "bg-sky-100", text: "text-sky-500 fill-sky-500" },
    indigo: { bg: "bg-indigo-100", text: "text-indigo-500 fill-indigo-500" },
    slate: { bg: "bg-slate-200", text: "text-slate-800 fill-slate-800" },
    orange: { bg: "bg-orange-100", text: "text-orange-500 fill-orange-500" },
    pink: { bg: "bg-pink-100", text: "text-pink-500 fill-pink-500" },
    violet: { bg: "bg-violet-100", text: "text-violet-500 fill-violet-500" },
    teal: { bg: "bg-teal-100", text: "text-teal-400 fill-teal-400" },
    red: { bg: "bg-red-100", text: "text-red-500 fill-red-500" },
    yellow: { bg: "bg-yellow-100", text: "text-yellow-400 fill-yellow-400" },
    blue: { bg: "bg-blue-100", text: "text-blue-600 fill-blue-600" },
    stone: { bg: "bg-stone-200", text: "text-stone-700 fill-stone-700" },
    neutral: { bg: "bg-neutral-100", text: "text-neutral-400 fill-neutral-400" }
  };

  const BaseStampIcon = ICONS[stampIcon] || Star;
  const isHexStampColor = stampColor?.startsWith('#');
  const stampTheme = isHexStampColor ? { bg: "", text: "" } : (COLORS[stampColor] || COLORS.amber);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const StampIcon = (props: any) => {
    const combinedStyle = isHexStampColor 
      ? { color: stampColor, fill: stampColor, ...props.style } 
      : props.style;
    return <BaseStampIcon {...props} style={combinedStyle} />;
  };

  const commonProps = {
    stamps: currentStamps,
    restaurantName,
    primaryColor,
    stampColor,
    StampIcon,
    stampTheme,
    rewardText: cycleRewardText,
    cardColor: cardColor || primaryColor || "#000000"
  };

  const handleLinkPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneToLink.trim()) return;
    setIsLinking(true);
    setLinkError("");
    try {
      const { linkPhoneNumber } = await import("./actions");
      const result = await linkPhoneNumber(cardId, phoneToLink.trim());
      if (result.error) {
        setLinkError(result.error);
      } else if (result.alreadyLinked && result.existingCardId) {
        // Redirect to their existing card seamlessly
        window.location.href = `/loyalty/${result.existingCardId}`;
      } else {
        setIsLinked(true);
      }
    } catch (err) {
      setLinkError("An unexpected error occurred.");
    } finally {
      setIsLinking(false);
    }
  };

  if (isPreviewMode) {
    return (
      <div className="w-full">
        {layout === "classic" && <Layouts.ClassicLayout {...commonProps} />}
        {layout === "digital" && <Layouts.DigitalLayout {...commonProps} />}
        {layout === "argentine" && <Layouts.ArgentineLayout {...commonProps} />}
        {layout === "coffee" && <Layouts.CoffeeLayout {...commonProps} />}
        {layout === "luxury" && <Layouts.LuxuryLayout {...commonProps} />}
        {layout === "arcade" && <Layouts.ArcadeLayout {...commonProps} />}
        {layout === "gradient" && <Layouts.GradientLayout {...commonProps} />}
        {layout === "corporate" && <Layouts.CorporateLayout {...commonProps} />}
        {layout === "birthday" && <Layouts.BirthdayLayout {...commonProps} />}
        {layout === "finedining" && <Layouts.FineDiningLayout {...commonProps} />}
        {layout === "botanical" && <Layouts.BotanicalLayout {...commonProps} />}
        {layout === "holographic" && <Layouts.HolographicLayout {...commonProps} />}
        {layout === "chalkboard" && <Layouts.ChalkboardLayout {...commonProps} />}
        {layout === "lumia" && <Layouts.LumiaLayout {...commonProps} />}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Active Reward Banner */}
      {currentActiveReward && !isPreviewMode && (
        <div className="bg-emerald-500 text-white px-4 py-4 rounded-xl shadow-lg mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-20">
            <Gift className="w-16 h-16" />
          </div>
          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-full shrink-0">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">A gift from the manager!</h3>
                <p className="text-emerald-50 text-sm font-medium mt-1 pr-6">
                  {currentActiveReward}
                </p>
              </div>
            </div>
            
            <button 
              onClick={async () => {
                if (confirmClaim) {
                  setIsClaimingReward(true);
                  setConfirmClaim(false);
                  const { claimActiveReward } = await import("./actions");
                  const res = await claimActiveReward(cardId);
                  if (res.success) {
                    setCurrentActiveReward(null);
                  } else {
                    alert("Failed to claim reward. Please try again.");
                  }
                  setIsClaimingReward(false);
                } else {
                  setConfirmClaim(true);
                  setTimeout(() => setConfirmClaim(false), 4000);
                }
              }}
              disabled={isClaimingReward}
              className={`w-full mt-1 font-bold py-2.5 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center ${
                confirmClaim
                  ? "bg-rose-500 text-white hover:bg-rose-600"
                  : "bg-white text-emerald-600 hover:bg-emerald-50"
              }`}
            >
              {isClaimingReward ? "Claiming..." : confirmClaim ? "Show this to your server to confirm!" : "Claim Reward"}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">VIP Loyalty Card</h1>
        <p className="text-slate-500">Show this card to your server to earn stamps.</p>
      </div>

      {/* Card Layouts */}
      {layout === "classic" && <Layouts.ClassicLayout {...commonProps} />}
      {layout === "digital" && <Layouts.DigitalLayout {...commonProps} />}
      {layout === "argentine" && <Layouts.ArgentineLayout {...commonProps} />}
      {layout === "coffee" && <Layouts.CoffeeLayout {...commonProps} />}
      {layout === "luxury" && <Layouts.LuxuryLayout {...commonProps} />}
      {layout === "arcade" && <Layouts.ArcadeLayout {...commonProps} />}
      {layout === "gradient" && <Layouts.GradientLayout {...commonProps} />}
      {layout === "corporate" && <Layouts.CorporateLayout {...commonProps} />}
      {layout === "birthday" && <Layouts.BirthdayLayout {...commonProps} />}
      {layout === "finedining" && <Layouts.FineDiningLayout {...commonProps} />}
      {layout === "botanical" && <Layouts.BotanicalLayout {...commonProps} />}
      {layout === "holographic" && <Layouts.HolographicLayout {...commonProps} />}
      {layout === "chalkboard" && <Layouts.ChalkboardLayout {...commonProps} />}
      {layout === "lumia" && <Layouts.LumiaLayout {...commonProps} />}

      {/* Action Area */}
      {isFull ? (
        activeMilestone ? (
          <div className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 border border-yellow-500 rounded-2xl p-6 text-center space-y-3 animate-in zoom-in-95 duration-500 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <PartyPopper className="w-24 h-24" />
            </div>
            <div className="flex justify-center relative z-10">
              <PartyPopper className="w-12 h-12 text-yellow-900" />
            </div>
            <h2 className="text-2xl font-black text-yellow-950 relative z-10 uppercase tracking-wider">Milestone Unlocked!</h2>
            <div className="bg-black/10 rounded-lg p-3 relative z-10">
              <p className="text-yellow-950 font-bold text-lg mb-1">
                You've reached {lifetimeVisits} visits!
              </p>
              <p className="text-yellow-900 text-sm">
                Show this screen to your server to claim your mega reward:
              </p>
              <strong className="block text-2xl mt-2 text-yellow-950 drop-shadow-sm">{activeMilestone.reward}</strong>
            </div>
            
            {confirmClaim ? (
              <div className="mt-4 pt-4 border-t border-yellow-600/30 relative z-10">
                <p className="text-sm text-yellow-900 font-bold mb-3 uppercase tracking-wide">Staff Only: Confirm Redemption</p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-white/50 border-yellow-600/30 text-yellow-900 hover:bg-white/80"
                    onClick={() => setConfirmClaim(false)}
                    disabled={isClaimingReward}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-yellow-900 hover:bg-black text-yellow-400"
                    onClick={async () => {
                      setIsClaimingReward(true);
                      const { redeemLoyaltyReward } = await import('./actions');
                      const res = await redeemLoyaltyReward(cardId);
                      if (res?.success) {
                        setCurrentStamps(Math.max(0, currentStamps - 10));
                        setCurrentCycles(c => c + 1);
                        setConfirmClaim(false);
                      } else {
                        alert(res?.error || "Failed to redeem reward.");
                      }
                      setIsClaimingReward(false);
                    }}
                    disabled={isClaimingReward}
                  >
                    {isClaimingReward ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Confirm"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                className="w-full mt-4 bg-yellow-900 hover:bg-black text-yellow-400 font-bold h-12 rounded-xl relative z-10 text-lg shadow-lg"
                onClick={() => setConfirmClaim(true)}
              >
                Redeem Mega Reward
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-3 animate-in zoom-in-95 duration-500">
            <div className="flex justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-green-900">Reward Unlocked!</h2>
            <p className="text-green-700 text-sm">
              You've collected 10 stamps! Show this screen to your server to claim: <strong className="block text-lg mt-1">{cycleRewardText}</strong>
            </p>
          
          {confirmClaim ? (
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-sm text-green-800 font-bold mb-3 uppercase tracking-wide">Staff Only: Confirm Redemption</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 bg-white border-green-200 text-green-700 hover:bg-green-50"
                  onClick={() => setConfirmClaim(false)}
                  disabled={isClaimingReward}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={async () => {
                    setIsClaimingReward(true);
                    const { redeemLoyaltyReward } = await import('./actions');
                    const res = await redeemLoyaltyReward(cardId);
                    if (res?.success) {
                      setCurrentStamps(Math.max(0, currentStamps - 10));
                      setCurrentCycles(c => c + 1);
                      setConfirmClaim(false);
                    } else {
                      alert(res?.error || "Failed to redeem reward.");
                    }
                    setIsClaimingReward(false);
                  }}
                  disabled={isClaimingReward}
                >
                  {isClaimingReward ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Confirm"}
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl"
              onClick={() => setConfirmClaim(true)}
            >
              Redeem Reward
            </Button>
          )}
        </div>
        )
      ) : (
        <div className="bg-white border-2 border-indigo-100 rounded-2xl p-6 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <h3 className="font-bold text-lg text-slate-900 mb-2">How to earn stamps</h3>
          <p className="text-slate-500 text-sm mb-3">
            On your next visit, ask your server to show you their secure <strong>Loyalty QR Code</strong>. Scan it with your phone's camera to instantly add a stamp to this card!
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
            <Check className="w-3.5 h-3.5" />
            Limit 1 stamp per visit (every 12 hours)
          </div>
        </div>
      )}

      {/* Phone Link Area */}
      {!isLinked && !isPreviewMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
          <h3 className="font-bold text-lg text-amber-900 mb-2 relative z-10">Secure Your Stamps!</h3>
          <p className="text-amber-700 text-sm mb-4 relative z-10">
            Link your phone number so you never lose your VIP card if you switch phones or browsers.
          </p>
          <form onSubmit={handleLinkPhone} className="flex flex-col gap-3 relative z-10">
            <input
              type="tel"
              placeholder="Your Phone Number"
              className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={phoneToLink}
              onChange={(e) => setPhoneToLink(e.target.value)}
              required
            />
            {linkError && <p className="text-red-500 text-xs text-left">{linkError}</p>}
            <button
              type="submit"
              disabled={isLinking}
              className="w-full bg-amber-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              {isLinking ? "Linking..." : "Link Phone Number"}
            </button>
          </form>
        </div>
      )}

      {/* Expiration Notice */}
      {!isPreviewMode && (
        <div className="text-center mt-8 opacity-60">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
            * Stamps automatically expire after 6 months of inactivity
          </p>
        </div>
      )}


    </div>
  );
}
