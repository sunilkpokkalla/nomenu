import { redirect } from "next/navigation";
import { Menu, QrCode } from "lucide-react";

import { Sidebar } from "@/components/dashboard/sidebar";
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
    .limit(1)
    .maybeSingle();

  const hasRestaurant = !!restaurant;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {hasRestaurant && <Sidebar plan={restaurant.plan || "Free"} />}
        <main className="min-h-screen flex-1">
          {hasRestaurant && (
            <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur lg:hidden">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                  <QrCode className="h-4 w-4" />
                </span>
                <span className="font-bold">NoMenu</span>
              </div>
              <button
                type="button"
                aria-label="Open navigation"
                className="rounded-lg border p-2 text-slate-600"
              >
                <Menu className="h-5 w-5" />
              </button>
            </header>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
