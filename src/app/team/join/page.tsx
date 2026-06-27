import { redirect } from "next/navigation";
import Link from "next/link";
import { QrCode, ShieldCheck } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { JoinTeamForm } from "./join-team-form";

export const dynamic = 'force-dynamic';

export default async function TeamJoinPage(
  props: { searchParams: Promise<{ token?: string; message?: string }> }
) {
  const searchParams = await props.searchParams;
  const token = searchParams.token;

  if (!token) {
    redirect("/");
  }

  const supabase = createAdminClient();

  // Find the invite
  const { data: invite } = await supabase
    .from("restaurant_staff")
    .select("*, restaurants(name)")
    .eq("id", token)
    .single();

  if (!invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-sm">
          <div className="mx-auto w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Invalid Invite</h2>
          <p className="text-slate-500 text-sm">
            This invitation link is invalid or has expired. Please ask your manager for a new link.
          </p>
        </div>
      </div>
    );
  }

  if (invite.status === "active") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-sm">
          <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Already Joined</h2>
          <p className="text-slate-500 text-sm mb-6">
            You have already accepted this invitation.
          </p>
          <Link href="/login" className="text-primary font-bold hover:underline">
            Go to Login &rarr;
          </Link>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const restaurantName = (invite.restaurants as any)?.name || "the restaurant";

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 font-sans-vibrant">
      {/* Left side brand */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e293b,transparent_75%)] opacity-50 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-md">
            <QrCode className="h-4.5 w-4.5" strokeWidth={1.5} />
          </div>
          <span className="font-bold tracking-tight text-xl">NoMenu</span>
        </div>
        
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
            Join the team at {restaurantName}.
          </h1>
          <p className="text-slate-400">
            You've been invited to access the restaurant dashboard as a {invite.role}. Create your password to gain access immediately.
          </p>
        </div>
        <div className="relative z-10 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} NoMenu. All rights reserved.
        </div>
      </div>

      {/* Right side form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-md">
              <QrCode className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <span className="font-bold tracking-tight text-lg">NoMenu</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Accept Invitation</h2>
            <p className="mt-2 text-sm text-slate-500">
              Create a password for your account <strong className="text-slate-700">{invite.email}</strong>.
            </p>
          </div>

          {searchParams.message && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {searchParams.message}
            </div>
          )}

          <JoinTeamForm token={token} email={invite.email} />
        </div>
      </div>
    </div>
  );
}
