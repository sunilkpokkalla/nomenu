import Link from "next/link";
import { QrCode, ArrowLeft } from "lucide-react";
import Image from "next/image";

import { login, loginWithGoogle } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function PartnerLoginPage(
  props: {
    searchParams: Promise<{ message?: string; next?: string }>;
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

          {searchParams.message && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 text-left">
              {searchParams.message}
            </div>
          )}

          <div className="space-y-6">
            {/* Google Login */}
            <form action={loginWithGoogle}>
              <Button type="submit" variant="outline" className="w-full h-14 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-bold flex items-center justify-center gap-3 text-sm rounded-xl shadow-sm transition-all">
                <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Log in with Google
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase font-extrabold tracking-widest">
                <span className="bg-white px-4 text-slate-400">Or</span>
              </div>
            </div>

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
