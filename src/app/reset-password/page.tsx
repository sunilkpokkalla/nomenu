import Link from "next/link";
import { redirect } from "next/navigation";
import { QrCode, KeyRound, ArrowLeft } from "lucide-react";
import Image from "next/image";

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
    <main className="flex min-h-screen bg-white font-sans-vibrant">
      {/* LEFT SIDE - EDITORIAL IMAGE */}
      <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden bg-slate-950">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="/auth-bg-reset.png" 
            alt="Waitstaff setting a luxury table" 
            fill 
            className="object-cover opacity-70"
            priority
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/10" />
        </div>

        {/* Brand Text over Image */}
        <div className="relative z-10 flex flex-col justify-end p-16 w-full">
          <div className="space-y-6 max-w-lg">
            <h2 className="text-4xl font-extrabold text-white leading-[1.1] tracking-tight">
              Create a secure password.
            </h2>
            <p className="text-lg text-slate-300 font-medium">
              Update your security credentials and get back to managing your digital dining experience.
            </p>
          </div>
        </div>

        {/* Absolute Back Button */}
        <Link href="/login" className="absolute top-8 left-8 text-white/70 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors z-20 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <ArrowLeft className="w-4 h-4" />
          Cancel reset
        </Link>
      </div>

      {/* RIGHT SIDE - MINIMALIST FORM */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-white">
        
        {/* Mobile Back Button */}
        <Link href="/login" className="lg:hidden absolute top-6 left-6 text-slate-500 hover:text-slate-900 flex items-center gap-2 text-sm font-semibold transition-colors z-20">
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </Link>

        <div className="w-full max-w-[420px] space-y-10">
          
          {/* Header */}
          <div className="space-y-3 text-left">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 shadow-sm mb-4">
              <QrCode className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-[2rem] font-black text-slate-950 tracking-tight leading-tight">Create New Password</h1>
            <p className="text-slate-500 font-medium text-base">
              Please enter your new password below. Make sure it is secure.
            </p>
          </div>

          {message && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-600 text-left flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold shrink-0 text-xs mt-0.5">!</div>
              <div>{message}</div>
            </div>
          )}

          <div className="space-y-6">
            <form action={resetPassword} className="space-y-5">
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-bold text-xs uppercase tracking-wider">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-14 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-950 focus-visible:border-slate-950 rounded-xl px-4 text-base shadow-sm"
                  minLength={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="h-14 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-950 focus-visible:border-slate-950 rounded-xl px-4 text-base shadow-sm"
                  minLength={8}
                  required
                />
              </div>

              <Button type="submit" className="w-full h-14 bg-slate-950 hover:bg-slate-900 text-white font-bold text-base mt-2 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Reset Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
