import Link from "next/link";
import { QrCode, ArrowLeft } from "lucide-react";
import Image from "next/image";

import { login } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function PartnerLoginPage(
  props: {
    searchParams: Promise<{ message?: string; success?: string; next?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  return (
    <main className="flex min-h-screen bg-slate-50 font-sans-vibrant">
      {/* LEFT SIDE - EDITORIAL IMAGE */}
      <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden bg-slate-950">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="/partner-login-bg.png" 
            alt="High end business office" 
            fill 
            className="object-cover opacity-30 mix-blend-luminosity"
            priority
          />
          {/* Subtle gradient overlay to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950/90 via-slate-950/40 to-slate-950/10" />
        </div>

        {/* Brand Text over Image */}
        <div className="relative z-10 flex flex-col justify-end p-16 w-full">
          <div className="space-y-6 max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-amber-500 uppercase tracking-wider w-fit">
              Partner Program
            </span>
            <h2 className="text-4xl font-extrabold text-white leading-[1.1] tracking-tight">
              Welcome back, Partner.
            </h2>
            <p className="text-lg text-slate-300 font-medium">
              Log in to track your referrals, view active conversions, and monitor your pending payouts.
            </p>
          </div>
        </div>

        {/* Absolute Back Button */}
        <Link href="/partners" className="absolute top-8 left-8 text-white/70 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors z-20 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <ArrowLeft className="w-4 h-4" />
          Back to Partners
        </Link>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-white border-l border-slate-200">
        
        {/* Mobile Back Button (Only shows on mobile) */}
        <Link href="/partners" className="lg:hidden absolute top-6 left-6 text-slate-500 hover:text-slate-900 flex items-center gap-2 text-sm font-semibold transition-colors z-20">
          <ArrowLeft className="w-4 h-4" />
          Partners
        </Link>

        <div className="w-full max-w-[420px] space-y-10">
          
          {/* Header */}
          <div className="space-y-3 text-left">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 shadow-sm mb-4">
              <QrCode className="h-6 w-6 text-amber-950" strokeWidth={2} />
            </div>
            <h1 className="text-[2rem] font-black text-slate-950 tracking-tight leading-tight">Partner Login</h1>
            <p className="text-slate-500 font-medium text-base">
              Enter your credentials to access your partner dashboard.
            </p>
          </div>

          {searchParams.success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 text-left">
              {searchParams.success}
            </div>
          )}

          {searchParams.message && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 text-left">
              {searchParams.message}
            </div>
          )}

          <div className="space-y-6">



            <form action={login} className="space-y-5">
              <input type="hidden" name="next" value={searchParams.next ?? "/partners/dashboard"} />
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@agency.com"
                  className="h-14 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-amber-500 focus-visible:border-amber-500 rounded-xl px-4 text-base shadow-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-amber-600 hover:text-amber-800 font-bold transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-14 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-amber-500 focus-visible:border-amber-500 rounded-xl px-4 text-base shadow-sm"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-base mt-2 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Log Into Dashboard
              </Button>
            </form>
          </div>

          <p className="pt-4 text-left text-sm text-slate-500 font-medium border-t border-slate-100">
            Don't have a partner account?{" "}
            <Link href="/partners/signup" className="text-amber-600 hover:underline font-black">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
