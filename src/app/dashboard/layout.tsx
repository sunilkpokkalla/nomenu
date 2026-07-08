import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { TopHeader } from "@/components/dashboard/top-header";
import { hasSupabaseEnv, getSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { getActiveRestaurant, UserRole } from "@/lib/rbac";
import { GlobalOrderListener } from "@/components/dashboard/global-order-listener";
import { DemoModeBanner } from "@/components/dashboard/demo-banner";
import { isDemoUser } from "@/lib/demo";

export const dynamic = 'force-dynamic';

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

  const restaurant = await getActiveRestaurant(supabase, user.id);
  const hasRestaurant = !!restaurant;
  
  // Default to owner if not explicitly a staff role
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role: UserRole = (restaurant as any)?._staffRole || "owner";
  
  const env = getSupabaseEnv();

  return (
    <div className="min-h-screen bg-slate-50">
      {isDemoUser(user) && <DemoModeBanner />}
      <div className="flex">
        {hasRestaurant && <Sidebar plan={restaurant.plan || "Free"} role={role} />}
        <main className="min-h-screen flex-1 flex flex-col">
          {hasRestaurant && <MobileNav plan={restaurant.plan || "Free"} role={role} />}
          {hasRestaurant && <TopHeader />}
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
      {hasRestaurant && (
        <GlobalOrderListener 
          restaurantId={restaurant.id}
          supabaseUrl={env.url}
          supabaseAnonKey={env.anonKey}
        />
      )}
    </div>
  );
}
