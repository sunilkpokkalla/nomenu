import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveRestaurant, getUserRole, hasPermission } from "@/lib/rbac";
import { LiveFeedbackClient } from "./live-feedback-board";
import { getSupabaseEnv } from "@/lib/env";

export default async function LiveFeedbackPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const restaurant = await getActiveRestaurant(supabase, user.id);

  if (!restaurant) {
    redirect("/dashboard/settings");
  }

  const userRole = await getUserRole(supabase, user.id, restaurant.id);
  
  if (!hasPermission(userRole, ["manager"])) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100 font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-rose-200 text-center max-w-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500 border border-rose-100 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900">Access Denied</h3>
          <p className="mt-3 text-sm text-slate-500 mb-6 font-medium">
            You do not have permission to view the Live Feedback board. This requires Manager or Owner access.
          </p>
        </div>
      </div>
    );
  }

  // Fetch initial feedback (today's)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: initialFeedback } = await supabase
    .from("customer_feedback")
    .select("*, qr_codes(label, location_zone), loyalty_cards(id, stamps, last_stamp_at)")
    .eq("restaurant_id", restaurant.id)
    .gte("created_at", today.toISOString())
    .order("created_at", { ascending: false });

  return (
    <LiveFeedbackClient 
      initialFeedback={initialFeedback || []}
      restaurantId={restaurant.id}
      supabaseUrl={getSupabaseEnv().url}
      supabaseAnonKey={getSupabaseEnv().anonKey}
      timezone={restaurant.timezone || "UTC"}
    />
  );
}
