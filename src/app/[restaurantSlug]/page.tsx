import type { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(
  props: { params: Promise<{ restaurantSlug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const supabase = await createClient();
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("name, cuisine_type")
    .eq("slug", params.restaurantSlug)
    .maybeSingle();

  if (!restaurant) {
    return { title: "Restaurant Not Found | NoMenu" };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${restaurant.name} | Digital Menu by NoMenu`,
    description: `View the digital menu for ${restaurant.name}, offering amazing ${restaurant.cuisine_type || 'cuisine'}. Order directly from your phone.`,
    openGraph: {
      title: `${restaurant.name} | Digital Menu by NoMenu`,
      description: `View the digital menu for ${restaurant.name}, offering amazing ${restaurant.cuisine_type || 'cuisine'}. Order directly from your phone.`,
      images: [...previousImages],
    },
    twitter: {
      title: `${restaurant.name} | Digital Menu by NoMenu`,
      description: `View the digital menu for ${restaurant.name}. Order directly from your phone.`,
    }
  };
}

export default async function RestaurantRootPage(
  props: {
    params: Promise<{ restaurantSlug: string }>;
  }
) {
  const params = await props.params;
  const restaurantSlug = params.restaurantSlug;

  const supabase = await createClient();

  // 1. Fetch restaurant
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, plan")
    .eq("slug", restaurantSlug)
    .maybeSingle();

  if (!restaurant) {
    notFound();
  }

  // Enforce tier subdomain before redirecting
  const host = (await headers()).get("host") || "";
  const isMenuHost = host.startsWith("menu.");
  const isOrderHost = host.startsWith("order.");
  const plan = restaurant.plan?.toLowerCase() || "free";
  
  if (['elite', 'enterprise'].includes(plan) && isMenuHost) {
    const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const protocol = rawAppUrl.startsWith("https") ? "https" : "http";
    const rootDomain = rawAppUrl.replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "");
    redirect(`${protocol}://order.${rootDomain}/${restaurantSlug}`);
  } else if (['free', 'pro'].includes(plan) && isOrderHost) {
    const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const protocol = rawAppUrl.startsWith("https") ? "https" : "http";
    const rootDomain = rawAppUrl.replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "");
    redirect(`${protocol}://menu.${rootDomain}/${restaurantSlug}`);
  }

  // 2. Fetch first active menu
  const { data: menu } = await supabase
    .from("menus")
    .select("slug")
    .eq("restaurant_id", restaurant.id)
    .eq("is_active", true)
    .not("slug", "is", null)
    .limit(1)
    .maybeSingle();

  if (menu && menu.slug) {
    redirect(`/${restaurantSlug}/${menu.slug}`); 
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome</h1>
        <p className="text-muted-foreground">This restaurant currently has no active menus.</p>
      </div>
    </div>
  );
}
