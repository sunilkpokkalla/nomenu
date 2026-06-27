import { redirect } from "next/navigation";
import { LifeBuoy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SupportForm } from "./support-form";
import { getActiveRestaurant, UserRole } from "@/lib/rbac";

export const metadata = {
  title: "Support | NoMenu Dashboard",
  description: "Get help and raise a support ticket.",
};

export default async function SupportPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's restaurant
  const restaurant = await getActiveRestaurant(supabase, user.id);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <LifeBuoy className="w-8 h-8 text-indigo-600" />
          Support Tickets
        </h1>
        <p className="text-slate-500">
          Need help? Raise a ticket and our support team will get back to you via email.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8">
          <SupportForm 
            userEmail={user.email || ""} 
            restaurantName={restaurant?.name || "No Restaurant Set"} 
          />
        </div>
      </div>
    </div>
  );
}
