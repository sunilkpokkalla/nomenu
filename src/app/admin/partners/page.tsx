import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { PartnersClient } from "./PartnersClient";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "admin@nomenu.us").split(",");
  if (!adminEmails.includes(user.email)) {
    redirect("/dashboard");
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
  );

  const { data: partners, error } = await adminSupabase
    .from("affiliates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-8 text-red-500 font-bold">Failed to load partners: {error.message}</div>;
  }

  const pending = partners?.filter(p => p.status === "pending") || [];
  const approved = partners?.filter(p => p.status === "approved" || p.status === null) || []; // Treat null as approved for legacy users
  const rejected = partners?.filter(p => p.status === "rejected") || [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans-vibrant">
      <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
        
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Partner Applications</h1>
          <p className="text-slate-500 font-medium mt-1">Review and manage incoming applications to the NoMenu Partner Program.</p>
        </div>

        <PartnersClient pending={pending} approved={approved} rejected={rejected} />

      </div>
    </div>
  );
}
