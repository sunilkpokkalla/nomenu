import { redirect } from "next/navigation";
import Link from "next/link";
import { getActiveRestaurant, UserRole } from "@/lib/rbac";
import { createClient } from "@/lib/supabase/server";
import { SettingsTabs } from "./settings-tabs";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const restaurant = await getActiveRestaurant(supabase, user.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role: UserRole = (restaurant as any)?._staffRole || "owner";

  if (role !== "owner") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Settings</h1>
        <p className="mt-1 text-slate-600">
          Manage your restaurant profile, preferences, and staff members.
        </p>
      </div>

      <SettingsTabs />
      
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}
