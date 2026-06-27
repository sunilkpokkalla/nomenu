import { Users, UserPlus, Mail, Shield, ShieldAlert, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveRestaurant, UserRole } from "@/lib/rbac";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InviteStaffForm } from "./invite-staff-form";

export const dynamic = 'force-dynamic';

export default async function TeamSettingsPage(
  props: { searchParams: Promise<{ message?: string; success?: string }> }
) {
  const searchParams = await props.searchParams;
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

  // Fetch current staff
  const { data: staffMembers } = await supabase
    .from("restaurant_staff")
    .select("*")
    .eq("restaurant_id", restaurant!.id)
    .order("created_at", { ascending: true });

  const roleLabels: Record<string, string> = {
    manager: "Manager (Full Access)",
    kitchen: "Kitchen Staff (KDS Only)",
    waitstaff: "Waitstaff (Orders Only)",
  };

  return (
    <div className="space-y-8">
      {searchParams.success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {searchParams.success}
        </div>
      )}
      {searchParams.message && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {searchParams.message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Team & Staff
          </CardTitle>
          <CardDescription>
            Invite team members to manage your menus, orders, and kitchen display.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Owner row */}
                <tr className="bg-white">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{user.email}</div>
                        <div className="text-xs text-slate-500">Owner</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      <Shield className="h-3.5 w-3.5" /> Owner
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs text-slate-400">Cannot remove</span>
                  </td>
                </tr>

                {/* Staff rows */}
                {staffMembers?.map((staff) => (
                  <tr key={staff.id} className="bg-white hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                          {staff.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-semibold text-slate-900">{staff.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {roleLabels[staff.role] || staff.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {staff.status === "active" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                          <Mail className="h-3 w-3" />
                          Invited
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={async () => {
                        "use server";
                        const supabase = await createClient();
                        await supabase.from("restaurant_staff").delete().eq("id", staff.id);
                        redirect("/dashboard/settings/team?success=Team member removed");
                      }}>
                        <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}

                {staffMembers?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                        <Users className="h-5 w-5 text-slate-400" />
                      </div>
                      <p className="text-sm">You haven't invited any team members yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" /> Invite Team Member
          </CardTitle>
          <CardDescription>
            Send an email invitation to a staff member. They will be prompted to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InviteStaffForm restaurantId={restaurant!.id} />
        </CardContent>
      </Card>
    </div>
  );
}
