import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoyaltyCardUI } from "@/app/loyalty/[id]/loyalty-card-ui";
import { AddToHomeScreen } from "@/components/pwa/add-to-home-screen";

export const dynamic = 'force-dynamic';

export default async function LoyaltyCardPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const cardId = params.id;

  const supabase = await createClient();

  const { data: card, error } = await supabase
    .from("loyalty_cards")
    .select("*, restaurants (name, logo_url, primary_color, loyalty_stamp_color, loyalty_stamp_icon, loyalty_card_layout)")
    .eq("id", cardId)
    .maybeSingle();

  if (error || !card || !card.restaurants) {
    notFound();
  }

  if (!card.restaurant_id) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Card</h1>
        <p className="text-slate-500 mb-6">This loyalty card is missing a restaurant.</p>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const restaurant = card.restaurants as any;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <LoyaltyCardUI 
        cardId={card.id} 
        restaurantId={card.restaurant_id as string}
        stamps={card.stamps} 
        restaurantName={restaurant.name}
        restaurantLogo={restaurant.logo_url}
        primaryColor={restaurant.primary_color || "#000000"}
        stampColor={restaurant.loyalty_stamp_color || "amber"}
        stampIcon={restaurant.loyalty_stamp_icon || "star"}
        layout={restaurant.loyalty_card_layout || "classic"}
        rewardText={restaurant.loyalty_reward_text}
        hasPhoneNumber={!!card.phone_number}
        activeReward={card.active_reward}
      />
      <AddToHomeScreen />
    </div>
  );
}
