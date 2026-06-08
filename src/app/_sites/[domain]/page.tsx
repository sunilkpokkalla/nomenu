import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DomainRootPage(
  props: {
    params: Promise<{ domain: string }>;
  }
) {
  const params = await props.params;
  const domain = params.domain;

  const supabase = await createClient();

  // 1. Fetch restaurant
  const { data: _restaurantData } = await supabase
    .from("restaurants")
    .select("id")
    .or(`subdomain.eq.${domain},custom_domain.eq.${domain}`)
    .maybeSingle();

  if (!_restaurantData) {
    notFound();
  }

  // 2. Fetch first active menu
  const { data: menu } = await supabase
    .from("menus")
    .select("slug")
    .eq("restaurant_id", _restaurantData.id)
    .eq("is_active", true)
    .not("slug", "is", null)
    .limit(1)
    .maybeSingle();

  if (menu && menu.slug) {
    redirect(`/${menu.slug}`); // It's rewritten by middleware, so relative path works nicely
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
