import Link from "next/link";
import { redirect } from "next/navigation";
import { QrCode, KeyRound } from "lucide-react";

import { resetPassword } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPasswordPage(
  props: {
    searchParams: Promise<{ message?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const message = searchParams.message;

  // Verify that the user actually has a valid session to reset their password
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Your%20password%20reset%20session%20is%20missing%20or%20expired.%20Please%20request%20a%20new%20link.");
  }

  return (
    <main className="flex min-h-screen bg-slate-50 items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Soft glowing orb behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]" />
      
      {/* White Card */}
      <div className="w-full max-w-[460px] bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] p-8 sm:p-10 z-10 relative border border-slate-100/50">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 text-primary mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
              <QrCode className="h-6 w-6" />
            </span>
            <span className="text-xl font-bold text-primary">NoMenu</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">Create New Password</h1>
          <p className="text-center text-sm text-slate-500 px-2">
            Please enter your new password below. Make sure it is secure.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-600 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold shrink-0 text-xs mt-0.5">!</div>
            <div>{message}</div>
          </div>
        )}

        <form action={resetPassword} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-600 font-normal">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="h-12 shadow-sm border-slate-200 focus-visible:ring-primary text-base px-4"
              minLength={8}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-600 font-normal">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="h-12 shadow-sm border-slate-200 focus-visible:ring-primary text-base px-4"
              minLength={8}
              required
            />
          </div>

          <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-base mt-2 shadow-sm">
            Reset Password
          </Button>
        </form>
      </div>
    </main>
  );
}
