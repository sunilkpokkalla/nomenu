import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoyaltyCardUI } from "@/app/loyalty/[id]/loyalty-card-ui";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const restaurant = card.restaurants as any;

  return (
    <div className="min-h-[100dvh] bg-slate-50 py-12 px-4 md:py-20 overflow-x-hidden">
      <LoyaltyCardUI 
        cardId={card.id} 
        restaurantId={card.restaurant_id}
        stamps={card.stamps} 
        restaurantName={restaurant.name}
        restaurantLogo={restaurant.logo_url}
        primaryColor={restaurant.primary_color || "#000000"}
        stampColor={restaurant.loyalty_stamp_color || "amber"}
        stampIcon={restaurant.loyalty_stamp_icon || "star"}
        layout={restaurant.loyalty_card_layout || "classic"}
        rewardText={restaurant.loyalty_reward_text}
      />
    </div>
  );
}
