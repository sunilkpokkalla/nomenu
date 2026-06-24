import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoyaltyCardUI } from "./loyalty-card-ui";

export default async function LoyaltyCardPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const cardId = params.id;

  const supabase = await createClient();

  const { data: card, error } = await supabase
    .from("loyalty_cards")
    .select("*, restaurants (name, logo_url, primary_color)")
    .eq("id", cardId)
    .maybeSingle();

  if (error || !card) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const restaurant = card.restaurants as any;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <LoyaltyCardUI 
        cardId={card.id} 
        restaurantId={card.restaurant_id}
        stamps={card.stamps} 
        restaurantName={restaurant?.name || "Restaurant"} 
        restaurantLogo={restaurant?.logo_url}
        primaryColor={restaurant?.primary_color || "#2563EB"}
      />
    </div>
  );
}
