import { redirect } from "next/navigation";
import { Menu, QrCode } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { TopHeader } from "@/components/dashboard/top-header";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasSupabaseEnv()) {
    redirect(
      "/login?message=Add%20Supabase%20env%20vars%20before%20opening%20the%20dashboard.",
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, plan")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const hasRestaurant = !!restaurant;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {hasRestaurant && <Sidebar plan={restaurant.plan || "Free"} />}
        <main className="min-h-screen flex-1 flex flex-col">
          {hasRestaurant && <MobileNav plan={restaurant.plan || "Free"} />}
          {hasRestaurant && <TopHeader />}
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
